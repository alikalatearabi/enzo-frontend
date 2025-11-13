import { cn } from "../../lib/utils/cn";
import { Button } from "./button";
import { BodyText, SectionTitle } from "./typography";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-layer/60 px-6 py-12 text-center",
        className,
      )}
    >
      <SectionTitle as="h3">{title}</SectionTitle>
      {description && (
        <BodyText className="max-w-sm text-sm text-muted-foreground">
          {description}
        </BodyText>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

