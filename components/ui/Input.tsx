import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export function Input({ id, label, className, ...props }: InputProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="text-xs font-medium tracking-[0.15em] text-brand-muted uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        className="w-full rounded-sm border border-brand-border bg-brand-surface px-3 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/70 focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal/40"
        {...props}
      />
    </div>
  );
}
