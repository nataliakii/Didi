"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface SearchInputProps {
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  onSearch: (value: string) => void;
  className?: string;
}

export function SearchInput({
  defaultValue = "",
  placeholder = "Search...",
  label = "Search",
  onSearch,
  className,
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className={cn("relative", className)}>
      <label htmlFor="search-input" className="sr-only">
        {label}
      </label>
      <input
        id="search-input"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-sm border border-brand-gold/30 bg-white px-4 py-2.5 pr-10 text-sm text-brand-charcoal placeholder:text-brand-charcoal/40 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-brand-charcoal/40 hover:text-brand-navy"
          aria-label="Clear search"
        >
          &times;
        </button>
      )}
    </div>
  );
}
