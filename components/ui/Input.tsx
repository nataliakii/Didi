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
        className="text-xs font-medium tracking-[0.15em] text-brand-navy/70 uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        className="w-full rounded-sm border border-brand-gold/30 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
        {...props}
      />
    </div>
  );
}
