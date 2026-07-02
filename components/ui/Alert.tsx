type AlertProps = {
  children: React.ReactNode;
  variant?: "error" | "success";
};

export default function Alert({ children, variant = "error" }: AlertProps) {
  const styles =
    variant === "success"
      ? "border-orange-200/80 bg-orange-50 text-orange-900 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-200"
      : "border-red-200/80 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300";

  return (
    <p className={`rounded-2xl border px-4 py-3 text-sm font-medium ${styles}`}>
      {children}
    </p>
  );
}
