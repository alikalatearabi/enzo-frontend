import { cn } from "../../lib/utils/cn";
import { Button } from "./button";
import { BodyText, SectionTitle } from "./typography";
import { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border/50 bg-gradient-to-br from-layer/40 to-layer/20 px-8 py-16 text-center transition-all hover:border-border/70",
        className,
      )}
    >
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-layer-hover/50 text-muted-foreground">
          <Icon className="h-8 w-8" strokeWidth={1.5} />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <SectionTitle as="h3" className="text-lg font-semibold">
          {title}
        </SectionTitle>
        {description && (
          <BodyText className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
            {description}
          </BodyText>
        )}
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

