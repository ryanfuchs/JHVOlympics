-- ELO ratings per player per game type

CREATE TABLE player_ratings (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_type_id UUID NOT NULL REFERENCES game_types(id) ON DELETE CASCADE,
  rating INT NOT NULL DEFAULT 1000 CHECK (rating >= 0),
  games_played INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, game_type_id)
);

CREATE TABLE match_elo_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating_before INT NOT NULL,
  rating_after INT NOT NULL,
  rating_delta INT NOT NULL,
  UNIQUE (match_id, user_id)
);

CREATE INDEX idx_player_ratings_game_type ON player_ratings(game_type_id);
CREATE INDEX idx_player_ratings_rating ON player_ratings(rating DESC);
CREATE INDEX idx_match_elo_changes_match_id ON match_elo_changes(match_id);

-- 2v2 team ELO: team rating = average of both players, K=32
CREATE OR REPLACE FUNCTION public.process_match_elo(p_match_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_game_type_id UUID;
  v_team1_score INT;
  v_team2_score INT;
  v_k CONSTANT INT := 32;
  v_team1_avg NUMERIC;
  v_team2_avg NUMERIC;
  v_expected_team1 NUMERIC;
  v_actual_team1 NUMERIC;
  v_delta INT;
  v_rec RECORD;
BEGIN
  IF EXISTS (SELECT 1 FROM match_elo_changes WHERE match_id = p_match_id) THEN
    RETURN;
  END IF;

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

  FOR v_rec IN
    SELECT mp.user_id, mp.team, pr.rating AS rating_before
    FROM match_players mp
    JOIN player_ratings pr
      ON pr.user_id = mp.user_id AND pr.game_type_id = v_game_type_id
    WHERE mp.match_id = p_match_id
  LOOP
    IF v_rec.team = 1 THEN
      v_delta := ROUND(v_k * (v_actual_team1 - v_expected_team1))::INT;
    ELSE
      v_delta := ROUND(v_k * ((1.0 - v_actual_team1) - (1.0 - v_expected_team1)))::INT;
    END IF;

    UPDATE player_ratings
    SET
      rating = GREATEST(0, rating + v_delta),
      games_played = games_played + 1,
      updated_at = NOW()
    WHERE user_id = v_rec.user_id AND game_type_id = v_game_type_id;

    INSERT INTO match_elo_changes (match_id, user_id, rating_before, rating_after, rating_delta)
    VALUES (
      p_match_id,
      v_rec.user_id,
      v_rec.rating_before,
      GREATEST(0, v_rec.rating_before + v_delta),
      v_delta
    );
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.trigger_process_match_elo()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM process_match_elo(NEW.match_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_match_player_insert_elo
  AFTER INSERT ON match_players
  FOR EACH ROW
  EXECUTE FUNCTION trigger_process_match_elo();

CREATE VIEW player_elo_by_game
WITH (security_invoker = true) AS
SELECT
  pr.user_id,
  p.display_name,
  pr.game_type_id,
  gt.name AS game_name,
  gt.icon AS game_icon,
  pr.rating,
  pr.games_played
FROM player_ratings pr
JOIN profiles p ON p.id = pr.user_id
JOIN game_types gt ON gt.id = pr.game_type_id
WHERE pr.games_played > 0;

CREATE VIEW player_elo_overall
WITH (security_invoker = true) AS
SELECT
  p.id AS user_id,
  p.display_name,
  ROUND(AVG(pr.rating))::INT AS rating,
  SUM(pr.games_played)::INT AS games_played
FROM profiles p
JOIN player_ratings pr ON pr.user_id = p.id
WHERE pr.games_played > 0
GROUP BY p.id, p.display_name;

ALTER TABLE player_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_elo_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings are viewable by authenticated users"
  ON player_ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "ELO changes are viewable by authenticated users"
  ON match_elo_changes FOR SELECT
  TO authenticated
  USING (true);

GRANT SELECT ON player_elo_by_game TO authenticated;
GRANT SELECT ON player_elo_overall TO authenticated;
