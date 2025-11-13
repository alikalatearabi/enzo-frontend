 "use client";

import { useState } from "react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { useFeatureModulesData } from "../../../hooks/catalog/useFeatureModulesData";
import { Select } from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { EmptyState } from "../../../components/ui/empty-state";
import { FeatureModuleModal } from "../../../components/catalog/modals/FeatureModuleModal";

export default function CatalogFeaturesPage() {
  const { modules, createModule, updateModule } = useFeatureModulesData();
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const selectedFeature = modules.find((feature) => feature.id === selectedFeatureId);

  const typeLabels: Record<string, string> = {
    frame: "Frame",
    lightThread: "Light Thread",
    backLight: "Back Light",
    zoom: "Zoom",
    thickness: "Thickness",
    sandblast: "Sandblast",
    lol: "LOL",
    mirrorModule: "Mirror Module",
  };

  const filteredModules = modules.filter((feature) => {
    const matchesType = typeFilter === "all" || feature.type === typeFilter;
    const matchesSearch =
      !searchTerm ||
      feature.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SectionSubtitle>Catalog</SectionSubtitle>
        <PageTitle>Feature Modules</PageTitle>
        <BodyText className="max-w-2xl">
          Maintain optional add-ons and their dependencies. Each item will map to
          accounting data and dynamic pricing rules, so keep configuration
          flexible.
        </BodyText>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">Modules Inventory</SectionTitle>
          <CardDescription>
            Mirrors <code>{"GET /{module}"}</code> responses (frame, lightThread, backLight, etc.) combined into a single view.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search feature module"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="max-w-xs"
            />
            <Select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="max-w-xs"
            >
              <option value="all">All types</option>
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
            <BodyText className="text-xs">
              Showing {filteredModules.length} of {modules.length} modules
            </BodyText>
          </div>

          {filteredModules.length === 0 ? (
            <EmptyState
              title="No feature modules found"
              description="Try updating the type filter or clearing the search to see more records."
              actionLabel="Reset filters"
              onAction={() => {
                setSearchTerm("");
                setTypeFilter("all");
              }}
            />
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Attributes</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModules.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {feature.name}
                      </span>
                      <MutedText>{feature.id}</MutedText>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground">
                      {typeLabels[feature.type]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {feature.layerCount && (
                        <span>Layers: {feature.layerCount}</span>
                      )}
                      {feature.code && <span>Code: {feature.code}</span>}
                      {!feature.layerCount && !feature.code && <span>—</span>}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(feature.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => {
                        setSelectedFeatureId(feature.id);
                        setModalMode("edit");
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
          <BodyText className="text-xs">
            Each module maintains its own CRUD endpoint. When connecting to the backend, filter by type and hydrate this table accordingly.
          </BodyText>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => {
            setSelectedFeatureId(null);
            setModalMode("create");
          }}
        >
          Add Feature Module
        </Button>
        <Button variant="subtle">Manage Dependencies</Button>
        <Button variant="ghost">View Accounting Mapping</Button>
      </div>

      {modalMode && (
        <FeatureModuleModal
          mode={modalMode}
          feature={modalMode === "edit" ? selectedFeature : undefined}
          onClose={() => setModalMode(null)}
          onSubmit={(payload) => {
            if (modalMode === "create") {
              createModule(payload);
            } else if (modalMode === "edit" && selectedFeature) {
              updateModule({ ...payload, id: selectedFeature.id });
            }
          }}
          existingModules={modules}
        />
      )}
    </section>
  );
}

