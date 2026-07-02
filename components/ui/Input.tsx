import { inputClassName } from "@/lib/styles";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
  return <input className={`${inputClassName} ${className}`} {...props} />;
}
