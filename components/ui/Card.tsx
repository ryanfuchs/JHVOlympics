import {
  cardClassName,
  gradientBorderAmber,
  gradientBorderRose,
  gradientBorderSky,
  gradientBorderViolet,
} from "@/lib/styles";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  accent?: "none" | "amber" | "sky" | "rose" | "violet";
};

const accentBorders = {
  none: null,
  amber: gradientBorderAmber,
  sky: gradientBorderSky,
  rose: gradientBorderRose,
  violet: gradientBorderViolet,
};

export default function Card({
  children,
  className = "",
  accent = "none",
}: CardProps) {
  const borderClass = accentBorders[accent];

  if (borderClass) {
    return (
      <div className={`rounded-3xl ${borderClass} shadow-xl shadow-violet-500/10 dark:shadow-black/25`}>
        <div className={`${cardClassName} rounded-[calc(1.5rem-1px)] ${className}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`${cardClassName} ${className}`}>{children}</div>
  );
}

export function SectionTitle({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-base font-bold tracking-tight">
      {icon && (
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 via-orange-500/20 to-rose-500/20 text-lg ring-1 ring-amber-400/20">
          {icon}
        </span>
      )}
      <span className="gradient-text-subtle">{children}</span>
    </h2>
  );
}
