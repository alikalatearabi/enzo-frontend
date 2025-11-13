import * as React from "react";
import { cn } from "../../lib/utils/cn";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  requiredMarker?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, requiredMarker, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    >
      {children}
      {requiredMarker && (
        <span className="ml-1 align-top text-xs text-red-500">*</span>
      )}
    </label>
  ),
);

Label.displayName = "Label";

