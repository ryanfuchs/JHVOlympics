export const GUEST_PLAYER_ID = "a0000000-0000-4000-8000-000000000001";
export const GUEST_DISPLAY_NAME = "Üse Gast";

export function isGuestName(name: string): boolean {
  return (
    name.trim().toLocaleLowerCase("de-CH") ===
    GUEST_DISPLAY_NAME.toLocaleLowerCase("de-CH")
  );
}

export function isGuestPlayer(player: {
  id?: string | null;
  user_id?: string | null;
  is_guest?: boolean | null;
}): boolean {
  return (
    player.is_guest === true ||
    player.id === GUEST_PLAYER_ID ||
    player.user_id === GUEST_PLAYER_ID
  );
}
