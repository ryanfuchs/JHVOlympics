-- Guest player "Üse Gast": selectable in 2v2 matches, ELO tracked, cannot log in.
-- Guest is a profiles row with no matching auth.users account.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_guest BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

CREATE OR REPLACE FUNCTION public.handle_deleted_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.profiles
  WHERE id = OLD.id
    AND is_guest = FALSE;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_deleted_user();

CREATE OR REPLACE FUNCTION public.protect_guest_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.is_guest THEN
      RAISE EXCEPTION 'The guest player cannot be deleted';
    END IF;
    RETURN OLD;
  END IF;

  IF OLD.is_guest THEN
    NEW.id := OLD.id;
    NEW.is_guest := TRUE;
    NEW.display_name := OLD.display_name;
  ELSE
    NEW.is_guest := FALSE;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_guest_profile ON profiles;
CREATE TRIGGER protect_guest_profile
  BEFORE UPDATE OR DELETE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_guest_profile();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, is_guest)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      split_part(NEW.email, '@', 1)
    ),
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own non-guest profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id AND is_guest = FALSE)
  WITH CHECK (auth.uid() = id AND is_guest = FALSE);

INSERT INTO profiles (id, display_name, is_guest)
VALUES (
  'a0000000-0000-4000-8000-000000000001',
  'Üse Gast',
  TRUE
)
ON CONFLICT (id) DO UPDATE
SET
  display_name = EXCLUDED.display_name,
  is_guest = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_one_guest
  ON profiles (is_guest)
  WHERE is_guest;

CREATE OR REPLACE VIEW player_stats
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
  END AS win_rate,
  p.is_guest
FROM profiles p
LEFT JOIN player_match_results pmr ON pmr.user_id = p.id
GROUP BY p.id, p.display_name, p.is_guest;

CREATE OR REPLACE VIEW player_stats_by_game
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
  END AS win_rate,
  p.is_guest
FROM profiles p
CROSS JOIN game_types gt
LEFT JOIN player_match_results pmr
  ON pmr.user_id = p.id AND pmr.game_type_id = gt.id
GROUP BY p.id, p.display_name, p.is_guest, gt.id, gt.name, gt.icon
HAVING COUNT(pmr.match_id) > 0;

CREATE OR REPLACE VIEW player_elo_by_game
WITH (security_invoker = true) AS
SELECT
  pr.user_id,
  p.display_name,
  pr.game_type_id,
  gt.name AS game_name,
  gt.icon AS game_icon,
  pr.rating,
  pr.games_played,
  p.is_guest
FROM player_ratings pr
JOIN profiles p ON p.id = pr.user_id
JOIN game_types gt ON gt.id = pr.game_type_id
WHERE pr.games_played > 0;

CREATE OR REPLACE VIEW player_elo_overall
WITH (security_invoker = true) AS
SELECT
  p.id AS user_id,
  p.display_name,
  ROUND(AVG(pr.rating))::INT AS rating,
  SUM(pr.games_played)::INT AS games_played,
  p.is_guest
FROM profiles p
JOIN player_ratings pr ON pr.user_id = p.id
WHERE pr.games_played > 0
GROUP BY p.id, p.display_name, p.is_guest;

REVOKE EXECUTE ON FUNCTION public.handle_deleted_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_guest_profile() FROM PUBLIC, anon, authenticated;
