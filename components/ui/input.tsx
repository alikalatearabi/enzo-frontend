import * as React from "react";
import { cn } from "../../lib/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, prefix, suffix, ...props }, ref) => {
    const hasAdornment = Boolean(prefix || suffix);
    return (
      <div
        className={cn(
          "flex h-10 w-full items-center rounded-md border border-border bg-layer px-3 text-sm text-foreground shadow-sm focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-surface focus-within:ring-primary",
          hasAdornment && "gap-2 px-3",
          className,
        )}
      >
        {prefix && <span className="text-muted-foreground">{prefix}</span>}
        <input
          ref={ref}
          className={cn(
            "h-full w-full bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60",
            hasAdornment && "flex-1",
          )}
          {...props}
        />
        {suffix && <span className="text-muted-foreground">{suffix}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";

