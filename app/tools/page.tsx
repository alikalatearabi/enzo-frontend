import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { BodyText, MutedText, PageTitle, SectionSubtitle, SectionTitle } from "../../components/ui/typography";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { useMockMirrors } from "../../lib/mocks/mirrors";
import { useMockFeatureModules } from "../../lib/mocks/features";

export default function ToolsPage() {
  const { data: mirrors } = useMockMirrors();
  const { data: features } = useMockFeatureModules();

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SectionSubtitle>Operations</SectionSubtitle>
        <PageTitle>Tools & Reporting</PageTitle>
        <BodyText className="max-w-2xl">
          Generate mirror configuration codes, download CSV exports, and surface
          operational metrics. All actions remain mocked until API integrations arrive.
        </BodyText>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <SectionTitle as="h3">Mirror-Code Generator</SectionTitle>
            <CardDescription>
              Initiate code runs, monitor progress, and download results for downstream systems.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <BodyText>
              Future implementation will collect filters (date ranges, mirror families)
              and present an activity log with download links.
            </BodyText>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Generate Codes</Button>
              <Button variant="secondary">Download Latest CSV</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SectionTitle as="h3">Operational Metrics</SectionTitle>
            <CardDescription>
              Placeholder cards for throughput metrics, pricing latency, and export logs.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="rounded-md border border-border bg-layer px-3 py-3">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Orders today
                </span>
                <p className="mt-1 text-xl font-semibold text-foreground">14</p>
              </div>
              <div className="rounded-md border border-border bg-layer px-3 py-3">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Avg pricing time
                </span>
                <p className="mt-1 text-xl font-semibold text-foreground">2m 18s</p>
              </div>
            </div>
            <Button variant="ghost" className="w-fit">
              View Logs
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Configuration Bundle</CardTitle>
          <CardDescription>
            Mocked data emulating `GET /mirror-code/generate` response entries.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mirror</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Hash</TableHead>
                <TableHead>Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mirrors.map((mirror) => {
                const featureNames =
                  mirror.features.mirrorModules?.map((id) => {
                    const moduleRecord = features.find((feature) => feature.id === id);
                    return moduleRecord?.name ?? "Module";
                  }) ?? [];
                return (
                  <TableRow key={mirror.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {mirror.name}
                        </span>
                        <MutedText>{mirror.shapeName}</MutedText>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {featureNames.map((name) => (
                          <span
                            key={name}
                            className="rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      9f9{mirror.id.slice(-6)}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      ENZ-{mirror.id.slice(-4).toUpperCase()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}

