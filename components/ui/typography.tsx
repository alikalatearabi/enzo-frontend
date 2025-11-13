import { cn } from "../../lib/utils/cn";

type AsElement = keyof React.JSX.IntrinsicElements;

type TypographyProps<T extends AsElement> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
};

function createTypographyComponent<T extends AsElement>(
  defaultTag: T,
  baseClass: string,
) {
  return function TypographyComponent<E extends AsElement = T>({
    as,
    className,
    ...props
  }: TypographyProps<E>) {
    const Component = (as ?? defaultTag) as React.ElementType;
    return <Component className={cn(baseClass, className)} {...props} />;
  };
}

export const PageTitle = createTypographyComponent("h1", "text-3xl font-semibold text-foreground lg:text-4xl");
export const SectionTitle = createTypographyComponent("h2", "text-xl font-semibold text-foreground");
export const SectionSubtitle = createTypographyComponent("p", "text-sm uppercase tracking-[0.2em] text-muted-foreground");
export const BodyText = createTypographyComponent("p", "text-sm text-muted-foreground leading-relaxed");
export const MutedText = createTypographyComponent("span", "text-xs text-muted-foreground");

