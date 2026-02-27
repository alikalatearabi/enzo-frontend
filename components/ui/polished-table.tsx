"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

type PolishedTableProps = {
  children: React.ReactNode;
  className?: string;
};

export function PolishedTable({ children, className }: PolishedTableProps) {
  return (
    <div className={`overflow-hidden rounded-lg border border-border ${className || ""}`}>
      <Table>{children}</Table>
    </div>
  );
}

type PolishedTableHeaderProps = {
  children: React.ReactNode;
};

export function PolishedTableHeader({ children }: PolishedTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow className="bg-layer-hover/50 hover:bg-layer-hover/50">
        {children}
      </TableRow>
    </TableHeader>
  );
}

type PolishedTableHeadProps = {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
};

export function PolishedTableHead({
  children,
  align = "right",
  className,
}: PolishedTableHeadProps) {
  const alignClass =
    align === "left" ? "text-left" : align === "center" ? "text-center" : "text-right";

  return (
    <TableHead className={`${alignClass} font-semibold text-foreground ${className || ""}`}>
      {children}
    </TableHead>
  );
}

type PolishedTableBodyProps = {
  children: React.ReactNode;
};

export function PolishedTableBody({ children }: PolishedTableBodyProps) {
  return <TableBody>{children}</TableBody>;
}

type PolishedTableRowProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function PolishedTableRow({ children, className, onClick }: PolishedTableRowProps) {
  return (
    <TableRow
      className={`transition-colors hover:bg-layer-hover/30 border-b border-border/50 last:border-b-0 ${className || ""} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {children}
    </TableRow>
  );
}

type PolishedTableCellProps = {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
};

export function PolishedTableCell({
  children,
  align = "right",
  className,
  onClick,
}: PolishedTableCellProps) {
  const alignClass =
    align === "left" ? "text-left" : align === "center" ? "text-center" : "text-right";

  return (
    <TableCell
      className={`${alignClass} py-4 ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </TableCell>
  );
}

