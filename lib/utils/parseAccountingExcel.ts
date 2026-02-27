/**
 * Parses an Excel file for accounting import.
 * Expected columns: NAME, RETAIL_PRICE, WHOLE_SALE_PRICE (headers are normalized).
 */

import * as XLSX from "xlsx";

export type ParsedAccountingRow = {
  name: string;
  retailPrice: number;
  wholeSalePrice: number;
};

export type ParseAccountingExcelResult =
  | { success: true; rows: ParsedAccountingRow[]; skipped: number }
  | { success: false; error: string };

const COL = {
  NAME: "name",
  RETAIL: "retailPrice",
  WHOLESALE: "wholeSalePrice",
} as const;

const ERRORS = {
  FILE_READ: "فایل خوانده نشد.",
  NO_SHEET: "هیچ برگه‌ای در فایل یافت نشد.",
  EMPTY_SHEET: "جدول خالی است.",
  MISSING_NAME: "ستون «name» (نام) یافت نشد. سرستون‌های مورد انتظار: name, retailPrice, wholeSalePrice",
  MISSING_PRICE_COLS: "ستون‌های retailPrice و wholeSalePrice یافت نشدند.",
  PARSE_ERROR: "خطا در خواندن فایل اکسل.",
  READ_ERROR: "خطا در خواندن فایل.",
} as const;

const HEADER_ALIASES: Record<string, string> = {
  name: COL.NAME,
  nam: COL.NAME,
  نام: COL.NAME,
  "item name": COL.NAME,
  item: COL.NAME,

  retailprice: COL.RETAIL,
  "retail price": COL.RETAIL,
  retail_price: COL.RETAIL,
  "قیمت خرده": COL.RETAIL,
  "قیمت خرده فروشی": COL.RETAIL,
  retail: COL.RETAIL,

  wholesaleprice: COL.WHOLESALE,
  "whole sale price": COL.WHOLESALE,
  "wholesale price": COL.WHOLESALE,
  whole_sale_price: COL.WHOLESALE,
  "قیمت عمده": COL.WHOLESALE,
  "قیمت عمده فروشی": COL.WHOLESALE,
  wholesale: COL.WHOLESALE,
};

function normalizeHeader(header: unknown): string {
  const raw = String(header ?? "")
    .replace(/^\uFEFF/, "") // UTF-8 BOM
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  return HEADER_ALIASES[raw] ?? raw;
}

function buildColumnMap(headerRow: unknown[]): Partial<Record<string, number>> {
  const colMap: Record<string, number> = {};
  headerRow.forEach((cell, index) => {
    const key = normalizeHeader(cell);
    if (key) colMap[key] = index;
  });
  if (colMap[COL.NAME] === undefined && headerRow.length > 0) {
    colMap[COL.NAME] = 0;
  }
  return colMap;
}

function safeNumber(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0 ? value : 0;
  }
  const normalized = String(value).replace(/,/g, "").trim();
  const n = Number(normalized);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function parseDataRows(
  rawRows: unknown[][],
  colMap: Partial<Record<string, number>>,
): { rows: ParsedAccountingRow[]; skipped: number } {
  const rows: ParsedAccountingRow[] = [];
  let skipped = 0;
  const nameIdx = colMap[COL.NAME] ?? -1;
  const retailIdx = colMap[COL.RETAIL] ?? -1;
  const wholesaleIdx = colMap[COL.WHOLESALE] ?? -1;

  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i] as unknown[] | undefined;
    if (!row || !Array.isArray(row)) continue;

    const name = String(row[nameIdx] ?? "").trim();
    if (!name) {
      skipped++;
      continue;
    }

    rows.push({
      name,
      retailPrice: safeNumber(retailIdx >= 0 ? row[retailIdx] : 0),
      wholeSalePrice: safeNumber(wholesaleIdx >= 0 ? row[wholesaleIdx] : 0),
    });
  }

  return { rows, skipped };
}

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (result instanceof ArrayBuffer) resolve(result);
      else reject(new Error(ERRORS.READ_ERROR));
    };
    reader.onerror = () => reject(new Error(ERRORS.READ_ERROR));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parses an Excel file (.xlsx / .xls) and extracts accounting rows.
 * First row is treated as headers; columns are matched by normalized names
 * (e.g. NAME, RETAIL_PRICE, WHOLE_SALE_PRICE). Rows with empty name are skipped.
 */
export async function parseAccountingExcel(
  file: File,
): Promise<ParseAccountingExcelResult> {
  try {
    const buffer = await readFileAsArrayBuffer(file);
    const workbook = XLSX.read(buffer, { type: "array" });

    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return { success: false, error: ERRORS.NO_SHEET };
    }

    const sheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];
    if (!rawRows.length) {
      return { success: false, error: ERRORS.EMPTY_SHEET };
    }

    const headerRow = rawRows[0] as unknown[];
    const colMap = buildColumnMap(headerRow);

    if (colMap[COL.NAME] === undefined) {
      return { success: false, error: ERRORS.MISSING_NAME };
    }
    if ((colMap[COL.RETAIL] ?? -1) < 0 || (colMap[COL.WHOLESALE] ?? -1) < 0) {
      return { success: false, error: ERRORS.MISSING_PRICE_COLS };
    }

    const { rows, skipped } = parseDataRows(rawRows, colMap);
    return { success: true, rows, skipped };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : ERRORS.PARSE_ERROR,
    };
  }
}
