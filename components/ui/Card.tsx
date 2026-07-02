import type { LucideIcon } from "lucide-react";
import { SectionIcon } from "@/components/LogoMark";
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
      <div className={`rounded-3xl ${borderClass} shadow-lg shadow-orange-950/10 dark:shadow-black/20`}>
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
  icon?: LucideIcon;
}) {
  return (
    <h2 className="mb-4 flex items-center gap-2.5 text-base font-semibold tracking-tight text-stone-900 dark:text-stone-50">
      {icon && <SectionIcon icon={icon} />}
      {children}
    </h2>
  );
}
