import { textareaClassName } from "@/lib/styles";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className = "", ...props }: TextareaProps) {
  return <textarea className={`${textareaClassName} ${className}`} {...props} />;
}
