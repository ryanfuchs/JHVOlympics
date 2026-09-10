-- Ensure the guest display name is exactly "Üse Gast"

DROP TRIGGER IF EXISTS protect_guest_profile ON profiles;

UPDATE profiles
SET display_name = chr(220) || 'se Gast'
WHERE id = 'a0000000-0000-4000-8000-000000000001';

CREATE TRIGGER protect_guest_profile
  BEFORE UPDATE OR DELETE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_guest_profile();
