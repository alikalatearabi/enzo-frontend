import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  BodyText,
  PageTitle,
  SectionSubtitle,
  SectionTitle,
} from "../components/ui/typography";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

export default function Home() {
  return (
    <section className="flex flex-1 flex-col gap-8">
      <div className="flex flex-col gap-3">
        <SectionSubtitle>Operations Console</SectionSubtitle>
        <PageTitle>Welcome to Enzo Mirror Operations</PageTitle>
        <BodyText className="max-w-2xl text-base">
          Configure catalog data, orchestrate customer orders, and prepare
          production assets for our customizable mirror line. Use the navigation
          to jump into catalog management, order intake, pricing, and reporting
          workflows.
        </BodyText>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Prepare Catalog Data</CardTitle>
            <CardDescription>
              Define mirror templates, shapes, and feature modules before
              accepting orders. Start with structured mocks until API integration
              is ready.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs uppercase tracking-wide text-muted-foreground">
            Step 1
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Map Order Workflows</CardTitle>
            <CardDescription>
              Implement the multi-step intake wizard to capture customer
              requests, mirror configurations, and dimensional data.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs uppercase tracking-wide text-muted-foreground">
            Step 2
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Surface Pricing & Codes</CardTitle>
            <CardDescription>
              Provide pricing triggers, accounting breakdowns, and mirror code
              exports to support downstream manufacturing.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs uppercase tracking-wide text-muted-foreground">
            Step 3
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_minmax(0,_1fr)]">
        <Card>
          <CardHeader>
            <SectionTitle as="h3">UI Reference</SectionTitle>
            <CardDescription>
              Quick glance at shared components to guide future module builds.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="subtle">Subtle</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" isLoading>
                Loading
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="demo-name" requiredMarker>
                  Mirror Name
                </Label>
                <Input id="demo-name" placeholder="Defogger Luxe XL" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="demo-shape">Shape</Label>
                <Select id="demo-shape" defaultValue="">
                  <option value="" disabled>
                    Select Shape
                  </option>
                  <option value="circle">Circle</option>
                  <option value="rectangle">Rectangle</option>
                  <option value="arch">Arch</option>
                </Select>
        </div>
        </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SectionTitle as="h3">Table Preview</SectionTitle>
            <CardDescription>
              Mimics order summary table styling before data wiring.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>#ENZ-1042</TableCell>
                  <TableCell>Marina Glass</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground">
                      Awaiting Pricing
                    </span>
                  </TableCell>
                  <TableCell className="text-right">$1,820.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>#ENZ-1039</TableCell>
                  <TableCell>Reflections Studio</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      In Production
                    </span>
                  </TableCell>
                  <TableCell className="text-right">$2,145.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
    </section>
  );
}
