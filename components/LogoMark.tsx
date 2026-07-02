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
      className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 font-bold tracking-tight text-white shadow-xl shadow-zinc-900/30 ring-1 ring-white/10 dark:from-zinc-100 dark:via-white dark:to-zinc-200 dark:text-zinc-900 ${sizes[size]} ${className}`}
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
    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700/80">
      <Icon size={16} strokeWidth={2} aria-hidden />
    </span>
  );
}
