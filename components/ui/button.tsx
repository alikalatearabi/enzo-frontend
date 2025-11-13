import * as React from "react";
import { cn } from "../../lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "subtle" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leadingIcon?: React.ReactElement;
  trailingIcon?: React.ReactElement;
}

const baseClasses =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-layer-hover text-foreground hover:bg-layer",
  subtle: "bg-surface text-foreground hover:bg-layer-hover border border-border",
  ghost: "bg-transparent text-foreground hover:bg-layer-hover",
  destructive: "bg-red-500 text-white hover:bg-red-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      leadingIcon,
      trailingIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const loading = isLoading ?? false;
    const content = (
      <>
        {leadingIcon && (
          <span className={cn("mr-2 inline-flex", loading && "opacity-0")}>
            {leadingIcon}
          </span>
        )}
        <span className={cn("inline-flex", loading && "opacity-0")}>
          {children}
        </span>
        {trailingIcon && (
          <span className={cn("ml-2 inline-flex", loading && "opacity-0")}>
            {trailingIcon}
          </span>
        )}
      </>
    );

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="mr-2 flex h-4 w-4 animate-spin rounded-full border-2 border-border border-t-transparent" />
        )}
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";

