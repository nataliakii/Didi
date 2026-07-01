import { cn } from "@/lib/utils";

interface CheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({
  id,
  label,
  checked = false,
  onChange,
  className,
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn("flex cursor-pointer items-center gap-2 text-sm text-stone-700", className)}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"
      />
      {label}
    </label>
  );
}
