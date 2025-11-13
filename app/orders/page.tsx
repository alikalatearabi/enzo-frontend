 "use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  BodyText,
  MutedText,
  PageTitle,
  SectionSubtitle,
  SectionTitle,
} from "../../components/ui/typography";
import { useOrdersData } from "../../hooks/orders/useOrdersData";
import { Select } from "../../components/ui/select";
import { useToast } from "../../components/ui/feedback/ToastProvider";
import { Input } from "../../components/ui/input";
import { EmptyState } from "../../components/ui/empty-state";

const statusOptions = [
  { value: "PROFORMA_INVOICE", label: "Proforma Invoice" },
  { value: "ASSEMBLY", label: "Assembly" },
  { value: "CUTTING", label: "Cutting" },
  { value: "LEAVING_WAREHOUSE", label: "Leaving Warehouse" },
];

export default function OrdersPage() {
  const { orders, updateOrderStatus, statusCounts } = useOrdersData();
  const statusLabel = statusOptions.reduce<Record<string, string>>(
    (acc, option) => {
      acc[option.value] = option.label;
      return acc;
    },
    {},
  );
  const [statusFilter, setStatusFilter] = useState<"all" | keyof typeof statusLabel>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      order.workOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  const { addToast } = useToast();

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SectionSubtitle>Operations</SectionSubtitle>
        <PageTitle>Orders</PageTitle>
        <BodyText className="max-w-2xl">
          Intake, track, and manage mirror production orders. The wizard flow will
          live here, transitioning from mocked state to live API integration.
        </BodyText>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="flex flex-col gap-2 py-4">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {statusLabel[status]}
              </span>
              <span className="text-2xl font-semibold text-foreground">
                {count}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">Recent Orders</SectionTitle>
          <CardDescription>
            Placeholder table to design around while we finalize the data model.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search work order or customer"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="max-w-xs"
            />
            <Select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className="max-w-xs"
            >
              <option value="all">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <BodyText className="text-xs">
              Showing {filteredOrders.length} of {orders.length} orders
            </BodyText>
          </div>

          {filteredOrders.length === 0 ? (
            <EmptyState
              title="No orders match your filters"
              description="Adjust the status filter or clear the search term to view more orders."
              actionLabel="Clear filters"
              onAction={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            />
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {order.workOrder}
                      </span>
                      <MutedText>{order.mirrorName}</MutedText>
                    </div>
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.cutterName}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onChange={(event) => {
                        const newStatus = event.target.value as typeof order.status;
                        updateOrderStatus({
                          orderId: order.id,
                          status: newStatus,
                        });
                        addToast({
                          title: "Status updated",
                          description: `Order ${order.workOrder} set to ${statusLabel[newStatus]}.`,
                          variant: "success",
                        });
                      }}
                      className="max-w-xs"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    {order.price > 0 ? `$${order.price.toLocaleString()}` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/orders/wizard"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          New Order Wizard
        </Link>
        <Button variant="secondary">Assign Operator</Button>
        <Button variant="ghost">View Workflow Settings</Button>
      </div>
    </section>
  );
}

