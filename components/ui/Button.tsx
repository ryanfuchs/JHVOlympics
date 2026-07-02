import { buttonPrimaryClassName } from "@/lib/styles";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  if (variant === "secondary") {
    return (
      <button
        className={`inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 to-zinc-100/60 px-5 py-3 text-[15px] font-semibold text-zinc-700 shadow-sm backdrop-blur-sm transition-all hover:from-white hover:to-zinc-50 active:scale-[0.98] disabled:opacity-50 dark:border-zinc-600/50 dark:from-zinc-900/80 dark:to-zinc-950/60 dark:text-zinc-200 dark:hover:to-zinc-900 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button className={`${buttonPrimaryClassName} ${className}`} {...props}>
      {children}
    </button>
  );
}
