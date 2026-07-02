import {
  Dumbbell,
  Gamepad2,
  Medal,
  Target,
  Timer,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export const GAME_ICON_KEYS = [
  "trophy",
  "medal",
  "target",
  "users",
  "timer",
  "dumbbell",
  "gamepad",
  "default",
] as const;

export type GameIconKey = (typeof GAME_ICON_KEYS)[number];

export const DEFAULT_GAME_ICON: GameIconKey = "trophy";

const ICON_COMPONENTS: Record<GameIconKey, LucideIcon> = {
  trophy: Trophy,
  medal: Medal,
  target: Target,
  users: Users,
  timer: Timer,
  dumbbell: Dumbbell,
  gamepad: Gamepad2,
  default: Trophy,
};

/** Legacy emoji values → icon keys (for existing DB rows). */
const LEGACY_EMOJI_MAP: Record<string, GameIconKey> = {
  "🏆": "trophy",
  "🏓": "target",
  "🏀": "dumbbell",
  "⚽": "target",
  "🎾": "target",
  "🏐": "users",
  "🎯": "target",
  "🎮": "gamepad",
  "🏅": "medal",
};

export function normalizeGameIcon(icon: string): GameIconKey {
  if (LEGACY_EMOJI_MAP[icon]) return LEGACY_EMOJI_MAP[icon];
  if ((GAME_ICON_KEYS as readonly string[]).includes(icon)) {
    return icon as GameIconKey;
  }
  return "default";
}

export function getGameIconComponent(icon: string): LucideIcon {
  return ICON_COMPONENTS[normalizeGameIcon(icon)];
}

export const GAME_ICON_LABELS: Record<GameIconKey, string> = {
  trophy: "Trophy",
  medal: "Medal",
  target: "Target",
  users: "Team",
  timer: "Timed",
  dumbbell: "Sport",
  gamepad: "Game",
  default: "Default",
};
