 "use client";

import { useState } from "react";
import Image from "next/image";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { useMockMirrors } from "../../../lib/mocks/mirrors";
import { useMockShapes } from "../../../lib/mocks/shapes";
import { useMockFeatureModules } from "../../../lib/mocks/features";
import { MirrorDrawer } from "../../../components/catalog/MirrorDrawer";
import { useMirrorFilters } from "../../../hooks/catalog/useMirrorFilters";

export default function CatalogMirrorsPage() {
  const { data: mirrors } = useMockMirrors();
  const { data: shapes } = useMockShapes();
  const { data: featureModules } = useMockFeatureModules();
  const {
    filteredMirrors,
    searchTerm,
    setSearchTerm,
    shapeFilter,
    setShapeFilter,
  } = useMirrorFilters(mirrors);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | null>(null);
  const [selectedMirrorId, setSelectedMirrorId] = useState<string | null>(null);
  const selectedMirror = mirrors.find((mirror) => mirror.id === selectedMirrorId);

  const findShape = (shapeId: string) =>
    shapes.find((shape) => shape.id === shapeId)?.name ?? "Unknown";

  const findFeature = (featureId: string | undefined) =>
    featureModules.find((feature) => feature.id === featureId)?.name ?? "—";

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SectionSubtitle>Catalog</SectionSubtitle>
        <PageTitle>Mirrors</PageTitle>
        <BodyText className="max-w-2xl">
          Manage mirror templates, base configurations, and default dimensions.
          Start by defining hero content and feature availability. Data is mocked
          until API endpoints are connected.
        </BodyText>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">Mirror Catalog</SectionTitle>
          <CardDescription>
            Mirrors returned from `GET /mirrors` with populated shape and media URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search by name or shape"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="max-w-xs"
            />
            <Select
              value={shapeFilter}
              onChange={(event) => setShapeFilter(event.target.value as "all" | string)}
              className="max-w-xs"
            >
              <option value="all">All shapes</option>
              {shapes.map((shape) => (
                <option key={shape.id} value={shape.id}>
                  {shape.name}
                </option>
              ))}
            </Select>
            <BodyText className="text-xs">
              Showing {filteredMirrors.length} of {mirrors.length} templates
            </BodyText>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mirror</TableHead>
                <TableHead>Shape</TableHead>
                <TableHead>Dimensions</TableHead>
                <TableHead>Features</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMirrors.map((mirror) => (
                <TableRow key={mirror.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-md border border-border bg-layer-hover">
                        {mirror.picture ? (
                          <Image
                            src={mirror.picture.url}
                            alt={mirror.name}
                            width={32}
                            height={32}
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No photo
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {mirror.name}
                        </span>
                        <MutedText>{mirror.id}</MutedText>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{findShape(mirror.shape)}</TableCell>
                  <TableCell>
                    {mirror.defaultHeight} x {mirror.defaultWidth} cm
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground">
                        Frame: {findFeature(mirror.features.frame)}
                      </span>
                      <span className="rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground">
                        Light: {findFeature(mirror.features.lightThread)}
                      </span>
                      <span className="rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground">
                        Back Light: {findFeature(mirror.features.backLight)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {mirror.price ? `$${mirror.price.toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => {
                        setSelectedMirrorId(mirror.id);
                        setDrawerMode("edit");
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <BodyText className="text-xs">
            When connected to the backend, replace this mock with data from `GET /mirrors`.
          </BodyText>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          onClick={() => {
            setSelectedMirrorId(null);
            setDrawerMode("create");
          }}
        >
          Add Mirror Template
        </Button>
        <Button variant="secondary">Upload Media</Button>
        <Button variant="ghost">Manage Shapes</Button>
      </div>

      {drawerMode && (
        <MirrorDrawer
          mode={drawerMode}
          mirror={drawerMode === "edit" ? selectedMirror : undefined}
          onClose={() => setDrawerMode(null)}
        />
      )}
    </section>
  );
}

