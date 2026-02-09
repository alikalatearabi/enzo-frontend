import * as React from "react";
import { cn } from "../../lib/utils/cn";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  leadingIcon?: React.ReactNode;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, leadingIcon, children, ...props }, ref) => {
    return (
      <div className="relative flex h-10 w-full items-center rounded-md border border-border bg-layer px-3 text-sm shadow-sm transition-colors hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface">
        {leadingIcon && (
          <span className="mr-2 text-muted-foreground">{leadingIcon}</span>
        )}
        <select
          ref={ref}
          className={cn(
            "h-full w-full appearance-none bg-transparent pr-6 text-foreground outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60",
            className,
          )}
          style={{
            backgroundImage: "none",
          }}
          {...props}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute left-3 text-muted-foreground">▾</span>
      </div>
    );
  },
);

Select.displayName = "Select";

