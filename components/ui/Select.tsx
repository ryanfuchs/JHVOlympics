import { selectClassName } from "@/lib/styles";

function Chevron() {
  return (
    <svg
      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className = "", children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select className={`${selectClassName} ${className}`} {...props}>
        {children}
      </select>
      <Chevron />
    </div>
  );
}
