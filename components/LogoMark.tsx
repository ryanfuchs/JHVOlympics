import type { LucideIcon } from "lucide-react";

type LogoMarkProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-base",
  lg: "h-16 w-16 text-lg",
};

export default function LogoMark({ className = "", size = "md" }: LogoMarkProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange-700 via-orange-800 to-orange-950 font-bold tracking-tight text-orange-50 shadow-lg shadow-orange-950/25 ring-1 ring-orange-600/30 ${sizes[size]} ${className}`}
      aria-hidden
    >
      JHV
    </div>
  );
}

export function SectionIcon({
  icon: Icon,
}: {
  icon: LucideIcon;
}) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-800 ring-1 ring-orange-200/80 dark:bg-orange-950/50 dark:text-orange-300 dark:ring-orange-900/50">
      <Icon size={16} strokeWidth={2} aria-hidden />
    </span>
  );
}
