import { cardClassName } from "@/lib/styles";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  accent?: "none" | "amber" | "sky" | "rose";
};

const accentStyles = {
  none: "",
  amber: "ring-1 ring-amber-400/20",
  sky: "ring-1 ring-sky-400/20",
  rose: "ring-1 ring-rose-400/20",
};

export default function Card({
  children,
  className = "",
  accent = "none",
}: CardProps) {
  return (
    <div className={`${cardClassName} ${accentStyles[accent]} ${className}`}>
      {children}
    </div>
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
    <h2 className="mb-4 flex items-center gap-2 text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </h2>
  );
}
