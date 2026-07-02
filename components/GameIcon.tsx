import {
  Dumbbell,
  Gamepad2,
  Medal,
  Target,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
import { normalizeGameIcon, type GameIconKey } from "@/lib/game-icons";

type GameIconProps = {
  icon: string;
  className?: string;
  size?: number;
};

const ICONS: Record<
  GameIconKey,
  typeof Trophy
> = {
  trophy: Trophy,
  medal: Medal,
  target: Target,
  users: Users,
  timer: Timer,
  dumbbell: Dumbbell,
  gamepad: Gamepad2,
  default: Trophy,
};

export default function GameIcon({
  icon,
  className = "text-zinc-600 dark:text-zinc-300",
  size = 18,
}: GameIconProps) {
  const key = normalizeGameIcon(icon);
  const Icon = ICONS[key];

  return (
    <Icon className={className} size={size} strokeWidth={2} aria-hidden />
  );
}
