type AlertProps = {
  children: React.ReactNode;
  variant?: "error" | "success";
};

export default function Alert({ children, variant = "error" }: AlertProps) {
  const styles =
    variant === "success"
      ? "border-emerald-200/80 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
      : "border-red-200/80 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300";

  return (
    <p className={`rounded-2xl border px-4 py-3 text-sm font-medium ${styles}`}>
      {children}
    </p>
  );
}
