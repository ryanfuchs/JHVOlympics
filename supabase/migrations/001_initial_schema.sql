-- JHVOlympics initial schema

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Game types
CREATE TABLE game_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT '🏆',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Matches
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type_id UUID NOT NULL REFERENCES game_types(id),
  team1_score INT NOT NULL CHECK (team1_score >= 0),
  team2_score INT NOT NULL CHECK (team2_score >= 0),
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Match players (2 per team, ad-hoc each game)
CREATE TABLE match_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  team SMALLINT NOT NULL CHECK (team IN (1, 2)),
  slot SMALLINT NOT NULL CHECK (slot IN (1, 2)),
  UNIQUE (match_id, user_id),
  UNIQUE (match_id, team, slot)
);

-- Indexes
CREATE INDEX idx_match_players_user_id ON match_players(user_id);
CREATE INDEX idx_matches_game_type_id ON matches(game_type_id);
CREATE INDEX idx_matches_played_at ON matches(played_at DESC);
CREATE INDEX idx_matches_created_by ON matches(created_by);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      split_part(NEW.email, '@', 1)
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed game types
INSERT INTO game_types (name, icon) VALUES
  ('Ping Pong', '🏓'),
  ('Basketball', '🏀'),
  ('FIFA', '⚽'),
  ('Tennis', '🎾'),
  ('Volleyball', '🏐'),
  ('Other', '🏆');

-- Stats: per-match result per player
CREATE OR REPLACE VIEW player_match_results AS
SELECT
  mp.user_id,
  m.id AS match_id,
  m.game_type_id,
  mp.team,
  CASE
    WHEN m.team1_score > m.team2_score AND mp.team = 1 THEN 'win'
    WHEN m.team2_score > m.team1_score AND mp.team = 2 THEN 'win'
    WHEN m.team1_score = m.team2_score THEN 'tie'
    ELSE 'loss'
  END AS result
FROM match_players mp
JOIN matches m ON m.id = mp.match_id;

CREATE VIEW player_stats
WITH (security_invoker = true) AS
SELECT
  p.id AS user_id,
  p.display_name,
  COUNT(pmr.match_id)::INT AS total_matches,
  COALESCE(SUM(CASE WHEN pmr.result = 'win' THEN 1 ELSE 0 END), 0)::INT AS wins,
  COALESCE(SUM(CASE WHEN pmr.result = 'loss' THEN 1 ELSE 0 END), 0)::INT AS losses,
  COALESCE(SUM(CASE WHEN pmr.result = 'tie' THEN 1 ELSE 0 END), 0)::INT AS ties,
  CASE
    WHEN COUNT(pmr.match_id) > 0 THEN
      ROUND(
        SUM(CASE WHEN pmr.result = 'win' THEN 1.0 ELSE 0 END) / COUNT(pmr.match_id) * 100,
        1
      )
    ELSE 0
  END AS win_rate
FROM profiles p
LEFT JOIN player_match_results pmr ON pmr.user_id = p.id
GROUP BY p.id, p.display_name;

CREATE VIEW player_stats_by_game
WITH (security_invoker = true) AS
SELECT
  p.id AS user_id,
  p.display_name,
  gt.id AS game_type_id,
  gt.name AS game_name,
  gt.icon AS game_icon,
  COUNT(pmr.match_id)::INT AS total_matches,
  COALESCE(SUM(CASE WHEN pmr.result = 'win' THEN 1 ELSE 0 END), 0)::INT AS wins,
  COALESCE(SUM(CASE WHEN pmr.result = 'loss' THEN 1 ELSE 0 END), 0)::INT AS losses,
  COALESCE(SUM(CASE WHEN pmr.result = 'tie' THEN 1 ELSE 0 END), 0)::INT AS ties,
  CASE
    WHEN COUNT(pmr.match_id) > 0 THEN
      ROUND(
        SUM(CASE WHEN pmr.result = 'win' THEN 1.0 ELSE 0 END) / COUNT(pmr.match_id) * 100,
        1
      )
    ELSE 0
  END AS win_rate
FROM profiles p
CROSS JOIN game_types gt
LEFT JOIN player_match_results pmr
  ON pmr.user_id = p.id AND pmr.game_type_id = gt.id
GROUP BY p.id, p.display_name, gt.id, gt.name, gt.icon
HAVING COUNT(pmr.match_id) > 0;

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_players ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Game types policies
CREATE POLICY "Game types are viewable by authenticated users"
  ON game_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can add game types"
  ON game_types FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Matches policies
CREATE POLICY "Matches are viewable by authenticated users"
  ON matches FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create matches"
  ON matches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their matches"
  ON matches FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can delete their matches"
  ON matches FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Match players policies
CREATE POLICY "Match players are viewable by authenticated users"
  ON match_players FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Match creators can add players"
  ON match_players FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_id
      AND matches.created_by = auth.uid()
    )
  );

CREATE POLICY "Match creators can update players"
  ON match_players FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_id
      AND matches.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_id
      AND matches.created_by = auth.uid()
    )
  );

CREATE POLICY "Match creators can delete players"
  ON match_players FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_id
      AND matches.created_by = auth.uid()
    )
  );

-- Grant view access
GRANT SELECT ON player_stats TO authenticated;
GRANT SELECT ON player_stats_by_game TO authenticated;
