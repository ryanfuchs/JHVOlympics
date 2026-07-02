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
        className={`inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-stone-200/90 bg-white px-5 py-3 text-[15px] font-semibold text-stone-700 shadow-sm transition-all hover:bg-stone-50 active:scale-[0.98] disabled:opacity-50 dark:border-stone-700/70 dark:bg-stone-900/80 dark:text-stone-200 dark:hover:bg-stone-800/80 ${className}`}
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
