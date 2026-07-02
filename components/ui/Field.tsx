import { labelClassName } from "@/lib/styles";

export function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <span className={labelClassName} {...(htmlFor ? { id: `${htmlFor}-label` } : {})}>
      {children}
    </span>
  );
}

export function Field({
  label,
  children,
  htmlFor,
}: {
  label: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="mt-0">{children}</div>
    </label>
  );
}
