"use client";

import * as React from "react";
import { cn } from "../../lib/utils/cn";

export type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function CustomSelect({
  value,
  onChange,
  options,
  className,
  placeholder,
  disabled,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<{ top: number; left: number; width: number } | null>(null);

  React.useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={selectRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-border bg-layer px-3 text-sm shadow-sm transition-colors",
          "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface",
          "disabled:cursor-not-allowed disabled:opacity-60",
          isOpen && "border-primary ring-2 ring-primary ring-offset-2 ring-offset-surface",
        )}
        dir="rtl"
      >
        <span className={cn("text-foreground", !selectedOption && "text-muted-foreground")}>
          {selectedOption?.label || placeholder || "انتخاب کنید"}
        </span>
        <svg
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180",
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && position && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed z-50 max-h-60 overflow-auto rounded-lg border border-border bg-layer shadow-lg"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
            }}
            dir="rtl"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-2.5 text-right text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                  "hover:bg-layer-hover focus:bg-layer-hover focus:outline-none",
                  value === option.value && "bg-primary/10 text-primary font-medium",
                  value !== option.value && "text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

