-- Quarterly seasons (with champions + medal table) and teammate combinations

-- ============================================================
-- Season helpers
-- ============================================================

-- Seasons are derived from played_at, so they roll over on their own.
-- Key format sorts chronologically as text: '2026-Q3'.
CREATE OR REPLACE FUNCTION public.season_key(ts TIMESTAMPTZ)
RETURNS TEXT
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT to_char(ts, 'YYYY') || '-Q' || to_char(ts, 'Q');
$$;

CREATE OR REPLACE FUNCTION public.current_season_key()
RETURNS TEXT
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT season_key(NOW());
$$;

-- Minimum matches needed to appear on a podium
CREATE OR REPLACE FUNCTION public.season_min_matches()
RETURNS INT LANGUAGE sql IMMUTABLE AS $$ SELECT 3; $$;

CREATE OR REPLACE FUNCTION public.season_event_min_matches()
RETURNS INT LANGUAGE sql IMMUTABLE AS $$ SELECT 2; $$;

-- One row, so the client never has to guess the season from its own clock
CREATE VIEW current_season
WITH (security_invoker = true) AS
SELECT current_season_key() AS season_key;

-- ============================================================
-- Per-match, per-player rows tagged with their season
-- ============================================================

CREATE VIEW season_player_results
WITH (security_invoker = true) AS
SELECT
  season_key(m.played_at) AS season_key,
  m.game_type_id,
  mp.user_id,
  m.id AS match_id,
  CASE
    WHEN m.team1_score = m.team2_score THEN 'tie'
    WHEN (m.team1_score > m.team2_score) = (mp.team = 1) THEN 'win'
    ELSE 'loss'
  END AS result,
  COALESCE(mec.rating_delta, 0) AS rating_delta
FROM match_players mp
JOIN matches m ON m.id = mp.match_id
LEFT JOIN match_elo_changes mec
  ON mec.match_id = mp.match_id AND mec.user_id = mp.user_id;

-- ============================================================
-- Season standings (all-around) — ranked by ELO gained in the season
-- ============================================================

CREATE VIEW season_standings
WITH (security_invoker = true) AS
WITH agg AS (
  SELECT
    r.season_key,
    r.user_id,
    p.display_name,
    p.is_guest,
    COUNT(*)::INT AS matches,
    COUNT(*) FILTER (WHERE r.result = 'win')::INT AS wins,
    COUNT(*) FILTER (WHERE r.result = 'loss')::INT AS losses,
    COUNT(*) FILTER (WHERE r.result = 'tie')::INT AS ties,
    SUM(r.rating_delta)::INT AS elo_delta
  FROM season_player_results r
  JOIN profiles p ON p.id = r.user_id
  GROUP BY r.season_key, r.user_id, p.display_name, p.is_guest
)
SELECT
  agg.season_key,
  agg.user_id,
  agg.display_name,
  agg.is_guest,
  agg.matches,
  agg.wins,
  agg.losses,
  agg.ties,
  agg.elo_delta,
  ROUND(agg.wins::NUMERIC / agg.matches * 100, 1) AS win_rate,
  (agg.matches >= season_min_matches() AND NOT agg.is_guest) AS qualified,
  RANK() OVER (
    PARTITION BY agg.season_key
    ORDER BY
      (agg.matches >= season_min_matches() AND NOT agg.is_guest) DESC,
      agg.elo_delta DESC,
      agg.wins DESC,
      agg.matches DESC
  )::INT AS rank
FROM agg;

-- ============================================================
-- Season standings per game type ("events")
-- ============================================================

CREATE VIEW season_event_standings
WITH (security_invoker = true) AS
WITH agg AS (
  SELECT
    r.season_key,
    r.game_type_id,
    gt.name AS game_name,
    gt.icon AS game_icon,
    r.user_id,
    p.display_name,
    p.is_guest,
    COUNT(*)::INT AS matches,
    COUNT(*) FILTER (WHERE r.result = 'win')::INT AS wins,
    COUNT(*) FILTER (WHERE r.result = 'loss')::INT AS losses,
    COUNT(*) FILTER (WHERE r.result = 'tie')::INT AS ties,
    SUM(r.rating_delta)::INT AS elo_delta
  FROM season_player_results r
  JOIN profiles p ON p.id = r.user_id
  JOIN game_types gt ON gt.id = r.game_type_id
  GROUP BY r.season_key, r.game_type_id, gt.name, gt.icon, r.user_id,
           p.display_name, p.is_guest
)
SELECT
  agg.season_key,
  agg.game_type_id,
  agg.game_name,
  agg.game_icon,
  agg.user_id,
  agg.display_name,
  agg.is_guest,
  agg.matches,
  agg.wins,
  agg.losses,
  agg.ties,
  agg.elo_delta,
  ROUND(agg.wins::NUMERIC / agg.matches * 100, 1) AS win_rate,
  (agg.matches >= season_event_min_matches() AND NOT agg.is_guest) AS qualified,
  RANK() OVER (
    PARTITION BY agg.season_key, agg.game_type_id
    ORDER BY
      (agg.matches >= season_event_min_matches() AND NOT agg.is_guest) DESC,
      agg.elo_delta DESC,
      agg.wins DESC,
      agg.matches DESC
  )::INT AS rank
FROM agg;

-- ============================================================
-- Champions and medals (finished seasons only)
-- ============================================================

CREATE VIEW season_champions
WITH (security_invoker = true) AS
SELECT
  s.season_key,
  s.user_id,
  s.display_name,
  s.matches,
  s.wins,
  s.losses,
  s.ties,
  s.win_rate,
  s.elo_delta
FROM season_standings s
WHERE s.rank = 1
  AND s.qualified
  AND s.season_key < current_season_key();

-- Ties share a rank, so two golds and no silver is intentional.
CREATE VIEW season_medals
WITH (security_invoker = true) AS
SELECT
  s.season_key,
  s.game_type_id,
  s.game_name,
  s.game_icon,
  s.user_id,
  s.display_name,
  CASE s.rank WHEN 1 THEN 'gold' WHEN 2 THEN 'silver' ELSE 'bronze' END AS medal
FROM season_event_standings s
WHERE s.qualified
  AND s.rank <= 3
  AND s.season_key < current_season_key();

CREATE VIEW season_medal_table
WITH (security_invoker = true) AS
WITH titles AS (
  SELECT user_id, COUNT(*)::INT AS titles
  FROM season_champions
  GROUP BY user_id
)
SELECT
  p.id AS user_id,
  p.display_name,
  COALESCE(t.titles, 0) AS titles,
  COUNT(*) FILTER (WHERE m.medal = 'gold')::INT AS gold,
  COUNT(*) FILTER (WHERE m.medal = 'silver')::INT AS silver,
  COUNT(*) FILTER (WHERE m.medal = 'bronze')::INT AS bronze,
  COUNT(m.user_id)::INT AS total
FROM profiles p
LEFT JOIN season_medals m ON m.user_id = p.id
LEFT JOIN titles t ON t.user_id = p.id
GROUP BY p.id, p.display_name, t.titles
HAVING COUNT(m.user_id) > 0 OR COALESCE(t.titles, 0) > 0;

-- ============================================================
-- Teammate combinations
-- ============================================================

-- One row per unordered pair of players who have shared a team.
-- chemistry = how the duo's win rate compares to what the two players
-- manage on their own, so a strong player carrying a weak one doesn't
-- automatically top the list.
CREATE VIEW teammate_pairs
WITH (security_invoker = true) AS
WITH pair_matches AS (
  SELECT
    a.user_id AS player_a_id,
    b.user_id AS player_b_id,
    CASE
      WHEN m.team1_score = m.team2_score THEN 'tie'
      WHEN (m.team1_score > m.team2_score) = (a.team = 1) THEN 'win'
      ELSE 'loss'
    END AS result,
    COALESCE(ca.rating_delta, 0) + COALESCE(cb.rating_delta, 0) AS elo_delta
  FROM match_players a
  JOIN match_players b
    ON b.match_id = a.match_id
   AND b.team = a.team
   AND b.user_id > a.user_id
  JOIN matches m ON m.id = a.match_id
  LEFT JOIN match_elo_changes ca ON ca.match_id = m.id AND ca.user_id = a.user_id
  LEFT JOIN match_elo_changes cb ON cb.match_id = m.id AND cb.user_id = b.user_id
),
agg AS (
  SELECT
    player_a_id,
    player_b_id,
    COUNT(*)::INT AS matches_together,
    COUNT(*) FILTER (WHERE result = 'win')::INT AS wins,
    COUNT(*) FILTER (WHERE result = 'loss')::INT AS losses,
    COUNT(*) FILTER (WHERE result = 'tie')::INT AS ties,
    SUM(elo_delta)::INT AS elo_delta
  FROM pair_matches
  GROUP BY player_a_id, player_b_id
)
SELECT
  agg.player_a_id,
  pa.display_name AS player_a_name,
  pa.is_guest AS player_a_is_guest,
  agg.player_b_id,
  pb.display_name AS player_b_name,
  pb.is_guest AS player_b_is_guest,
  agg.matches_together,
  agg.wins,
  agg.losses,
  agg.ties,
  agg.elo_delta,
  ROUND(agg.wins::NUMERIC / agg.matches_together * 100, 1) AS win_rate,
  ROUND(
    agg.wins::NUMERIC / agg.matches_together * 100 - (sa.win_rate + sb.win_rate) / 2,
    1
  ) AS chemistry
FROM agg
JOIN profiles pa ON pa.id = agg.player_a_id
JOIN profiles pb ON pb.id = agg.player_b_id
JOIN player_stats sa ON sa.user_id = agg.player_a_id
JOIN player_stats sb ON sb.user_id = agg.player_b_id;

-- ============================================================
-- Grants
-- ============================================================

GRANT SELECT ON current_season TO authenticated;
GRANT SELECT ON season_player_results TO authenticated;
GRANT SELECT ON season_standings TO authenticated;
GRANT SELECT ON season_event_standings TO authenticated;
GRANT SELECT ON season_champions TO authenticated;
GRANT SELECT ON season_medals TO authenticated;
GRANT SELECT ON season_medal_table TO authenticated;
GRANT SELECT ON teammate_pairs TO authenticated;
