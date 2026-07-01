import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  label: string;
  value?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Select({
  id,
  label,
  value = "",
  options,
  placeholder = "Select...",
  onChange,
  className,
}: SelectProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="text-xs font-medium tracking-[0.15em] text-brand-navy/70 uppercase"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full rounded-sm border border-brand-gold/30 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
