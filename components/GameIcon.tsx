import { getGameIconComponent, normalizeGameIcon } from "@/lib/game-icons";

type GameIconProps = {
  icon: string;
  className?: string;
  size?: number;
};

export default function GameIcon({
  icon,
  className = "text-zinc-600 dark:text-zinc-300",
  size = 18,
}: GameIconProps) {
  const Icon = getGameIconComponent(icon);
  const label = normalizeGameIcon(icon);

  return (
    <Icon
      className={className}
      size={size}
      strokeWidth={2}
      aria-hidden
      data-icon={label}
    />
  );
}
