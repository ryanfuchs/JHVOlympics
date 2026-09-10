-- ELO corrections:
--   * ratings are replayed in played_at order, so backdated matches rate correctly
--   * scores are edit/delete-safe: any change to matches or match_players re-rates everything
--   * margin of victory scales the rating change (scale-free, so it works across game types)
--   * the 0-point floor is gone (it silently broke zero-sum)
--   * overall rating is weighted by games played instead of a flat average across game types

-- The floor made the loser's clamped loss smaller than the winner's gain, minting points.
ALTER TABLE player_ratings DROP CONSTRAINT IF EXISTS player_ratings_rating_check;

-- Rates a single match against the CURRENT contents of player_ratings.
-- No idempotency guard: callers are responsible for ordering and for resetting
-- state. Use recalculate_all_elo() rather than calling this directly.
CREATE OR REPLACE FUNCTION public.apply_match_elo(p_match_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_game_type_id UUID;
  v_team1_score INT;
  v_team2_score INT;
  v_k CONSTANT NUMERIC := 32;
  v_team1_avg NUMERIC;
  v_team2_avg NUMERIC;
  v_expected_team1 NUMERIC;
  v_actual_team1 NUMERIC;
  v_margin_ratio NUMERIC;
  v_mov NUMERIC;
  v_correction NUMERIC;
  v_winner_advantage NUMERIC;
  v_scale NUMERIC;
  v_delta INT;
  v_rec RECORD;
BEGIN
  SELECT game_type_id, team1_score, team2_score
  INTO v_game_type_id, v_team1_score, v_team2_score
  FROM matches
  WHERE id = p_match_id;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  IF (SELECT COUNT(*) FROM match_players WHERE match_id = p_match_id) <> 4 THEN
    RETURN;
  END IF;

  INSERT INTO player_ratings (user_id, game_type_id)
  SELECT mp.user_id, v_game_type_id
  FROM match_players mp
  WHERE mp.match_id = p_match_id
  ON CONFLICT (user_id, game_type_id) DO NOTHING;

  SELECT AVG(pr.rating) INTO v_team1_avg
  FROM match_players mp
  JOIN player_ratings pr
    ON pr.user_id = mp.user_id AND pr.game_type_id = v_game_type_id
  WHERE mp.match_id = p_match_id AND mp.team = 1;

  SELECT AVG(pr.rating) INTO v_team2_avg
  FROM match_players mp
  JOIN player_ratings pr
    ON pr.user_id = mp.user_id AND pr.game_type_id = v_game_type_id
  WHERE mp.match_id = p_match_id AND mp.team = 2;

  v_expected_team1 := 1.0 / (1.0 + POWER(10, (v_team2_avg - v_team1_avg) / 400.0));

  IF v_team1_score > v_team2_score THEN
    v_actual_team1 := 1.0;
  ELSIF v_team1_score = v_team2_score THEN
    v_actual_team1 := 0.5;
  ELSE
    v_actual_team1 := 0.0;
  END IF;

  -- Margin of victory. Raw point margins are not comparable across game types
  -- (first-to-10 vs first-to-21), so use the margin as a share of total points:
  -- 0 for a one-point nailbiter, 1 for a shutout. Multiplier runs 1.0x .. 2.0x.
  IF v_actual_team1 = 0.5 OR (v_team1_score + v_team2_score) = 0 THEN
    v_mov := 1.0;
    v_correction := 1.0;
  ELSE
    v_margin_ratio := ABS(v_team1_score - v_team2_score)::NUMERIC
                      / (v_team1_score + v_team2_score);
    v_mov := 1.0 + v_margin_ratio;

    -- Without this, a heavy favourite winning big gains more than it should and
    -- ratings run away. Damps the multiplier when the winner was already ahead.
    IF v_actual_team1 = 1.0 THEN
      v_winner_advantage := v_team1_avg - v_team2_avg;
    ELSE
      v_winner_advantage := v_team2_avg - v_team1_avg;
    END IF;
    v_correction := GREATEST(0.5, LEAST(2.0, 2.2 / (0.001 * v_winner_advantage + 2.2)));
  END IF;

  -- One scalar shared by both teams, so team 2's delta stays the exact negation
  -- of team 1's and the match remains zero-sum.
  v_scale := v_k * v_mov * v_correction;

  FOR v_rec IN
    SELECT mp.user_id, mp.team, pr.rating AS rating_before
    FROM match_players mp
    JOIN player_ratings pr
      ON pr.user_id = mp.user_id AND pr.game_type_id = v_game_type_id
    WHERE mp.match_id = p_match_id
  LOOP
    IF v_rec.team = 1 THEN
      v_delta := ROUND(v_scale * (v_actual_team1 - v_expected_team1))::INT;
    ELSE
      v_delta := ROUND(v_scale * (v_expected_team1 - v_actual_team1))::INT;
    END IF;

    UPDATE player_ratings
    SET
      rating = rating + v_delta,
      games_played = games_played + 1,
      updated_at = NOW()
    WHERE user_id = v_rec.user_id AND game_type_id = v_game_type_id;

    INSERT INTO match_elo_changes (match_id, user_id, rating_before, rating_after, rating_delta)
    VALUES (p_match_id, v_rec.user_id, v_rec.rating_before, v_rec.rating_before + v_delta, v_delta)
    ON CONFLICT (match_id, user_id) DO UPDATE
    SET
      rating_before = EXCLUDED.rating_before,
      rating_after = EXCLUDED.rating_after,
      rating_delta = EXCLUDED.rating_delta;
  END LOOP;
END;
$$;

-- Wipes and replays every match in played_at order.
--
-- Ratings are path-dependent, so a match logged today but played last Monday can
-- only be rated correctly by replaying. A full replay also makes score edits and
-- match deletions self-healing. This is O(matches) per write, which is fine at
-- office-tournament scale; revisit if the match count reaches five figures.
CREATE OR REPLACE FUNCTION public.recalculate_all_elo()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_match_id UUID;
BEGIN
  DELETE FROM match_elo_changes;
  DELETE FROM player_ratings;

  FOR v_match_id IN
    SELECT id FROM matches ORDER BY played_at, id
  LOOP
    PERFORM apply_match_elo(v_match_id);
  END LOOP;
END;
$$;

-- Kept for compatibility with anything calling the old entry point by name.
CREATE OR REPLACE FUNCTION public.process_match_elo(p_match_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM recalculate_all_elo();
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_recalculate_elo()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM recalculate_all_elo();
  RETURN NULL;
END;
$$;

-- Statement-level so a four-row roster insert triggers one replay, not four.
-- A partially-inserted match is simply skipped by apply_match_elo and picked up
-- on the next statement, so no ordering assumptions are needed here.
DROP TRIGGER IF EXISTS on_match_player_insert_elo ON match_players;
DROP FUNCTION IF EXISTS public.trigger_process_match_elo();

DROP TRIGGER IF EXISTS on_match_players_change_elo ON match_players;
CREATE TRIGGER on_match_players_change_elo
  AFTER INSERT OR UPDATE OR DELETE ON match_players
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_recalculate_elo();

DROP TRIGGER IF EXISTS on_matches_change_elo ON matches;
CREATE TRIGGER on_matches_change_elo
  AFTER INSERT OR UPDATE OR DELETE ON matches
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_recalculate_elo();

-- Overall rating weighted by games played. A flat AVG let one lucky match in a
-- game type outrank fifty matches in another.
CREATE OR REPLACE VIEW player_elo_overall
WITH (security_invoker = true) AS
SELECT
  p.id AS user_id,
  p.display_name,
  ROUND(
    SUM(pr.rating::NUMERIC * pr.games_played) / NULLIF(SUM(pr.games_played), 0)
  )::INT AS rating,
  SUM(pr.games_played)::INT AS games_played,
  p.is_guest
FROM profiles p
JOIN player_ratings pr ON pr.user_id = p.id
WHERE pr.games_played > 0
GROUP BY p.id, p.display_name, p.is_guest;

-- Rebuild history under the new rules.
SELECT public.recalculate_all_elo();
