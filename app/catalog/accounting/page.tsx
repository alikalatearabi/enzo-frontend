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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useMockAccounting } from "../../../lib/mocks/accounting";

export default function CatalogAccountingPage() {
  const { data: sheets } = useMockAccounting();
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const selectedSheet = sheets.find((sheet) => sheet.id === selectedSheetId);

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SectionSubtitle>Catalog</SectionSubtitle>
        <PageTitle>Accounting Tables</PageTitle>
        <BodyText className="max-w-2xl">
          Manage price sheets keyed by feature names. These tables fuel order
          costing and should support CSV import/export for accounting teams.
        </BodyText>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">Active Sheets</SectionTitle>
          <CardDescription>
            Snapshot of mocked pricing sheets until we hook up the REST endpoints.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sheet</TableHead>
                <TableHead>Feature</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheets.map((sheet) => (
                <TableRow key={sheet.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {sheet.name}
                      </span>
                      <MutedText>{sheet.id}</MutedText>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {Object.values(sheet.items).map((item) => (
                        <span
                          key={item.featureName}
                          className="text-xs text-muted-foreground"
                        >
                          {item.featureName}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(sheet.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        sheet.status === "current"
                          ? "bg-primary/10 text-primary"
                          : "bg-layer-hover text-muted-foreground"
                      }`}
                    >
                      {sheet.status === "current" ? "Current" : "Superseded"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={() => setSelectedSheetId(sheet.id)}
                    >
                      View details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <BodyText className="text-xs">
            Replace this mock table with live data via `useAccountingSheets()` once
            endpoints are integrated.
          </BodyText>
        </CardContent>
      </Card>

      {selectedSheet && (
        <Card>
          <CardHeader>
            <SectionTitle as="h3">
              {selectedSheet.name} · Items
            </SectionTitle>
            <CardDescription>
              Expanded view of `items` map from the accounting sheet DTO.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(selectedSheet.items).map((item) => (
                  <TableRow key={`${selectedSheet.id}-${item.featureName}`}>
                    <TableCell>{item.featureName}</TableCell>
                    <TableCell>{item.code ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      ${item.price.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary">Export CSV</Button>
              <Button variant="ghost" onClick={() => setSelectedSheetId(null)}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Import CSV</Button>
        <Button variant="secondary">Create Sheet</Button>
        <Button variant="ghost">Download Template</Button>
      </div>
    </section>
  );
}

