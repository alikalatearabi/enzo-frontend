import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  BodyText,
  MutedText,
  PageTitle,
  SectionSubtitle,
  SectionTitle,
} from "../../../components/ui/typography";
import { useMockShapes } from "../../../lib/mocks/shapes";
import { useMockFeatureModules } from "../../../lib/mocks/features";

export default function CatalogShapesPage() {
  const { data: shapes } = useMockShapes();
  const { data: features } = useMockFeatureModules();

  const getThickness = (thicknessId: string) =>
    features.find(
      (feature) => feature.id === thicknessId && feature.type === "thickness",
    )?.name ?? "Unknown";

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SectionSubtitle>Catalog</SectionSubtitle>
        <PageTitle>Shapes</PageTitle>
        <BodyText className="max-w-2xl">
          Define the geometry options available for mirrors. Shapes drive both
          visualization and dimensional validation in the order intake wizard.
        </BodyText>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">Shape Library</SectionTitle>
          <CardDescription>
            Mock response aligned with `GET /shapes`, including custom fields like
            `deformed` and recommended thickness.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {shapes.map((shape) => (
            <div
              key={shape.id}
              className="flex flex-col gap-3 rounded-md border border-border bg-layer p-4"
            >
              <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-border bg-surface">
                <span className="text-sm font-semibold text-muted-foreground">
                  {shape.name}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <span className="font-semibold text-foreground">{shape.name}</span>
                <MutedText>ID: {shape.id}</MutedText>
                <MutedText>Aspect: {shape.aspectRatio}</MutedText>
                <MutedText>
                  Thickness: {getThickness(shape.recommendedThickness)}
                </MutedText>
                <span className="inline-flex w-fit items-center rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground">
                  {shape.deformed ? "Deformed" : "Standard"}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary">Add Shape</Button>
        <Button variant="ghost">Import Shapes</Button>
      </div>
    </section>
  );
}

