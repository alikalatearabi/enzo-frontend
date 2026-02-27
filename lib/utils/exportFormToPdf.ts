/**
 * Client-side PDF export of an HTML element using html2pdf.js.
 * Expects the element to be laid out in a compact single-page layout (e.g. via compactForPdf).
 * Use only in browser (e.g. in onClick or useEffect).
 */
export async function exportFormToPdf(
  element: HTMLElement,
  filename: string = "فرم-سفارش-آینه.pdf",
): Promise<void> {
  const html2pdf = (await import("html2pdf.js")).default;
  const opt = {
    margin: [8, 8, 8, 8],
    filename,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: {
      scale: 1.5,
      useCORS: true,
      logging: false,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm" as const,
      format: "a4" as const,
      orientation: "portrait" as const,
    },
    pagebreak: { mode: ["avoid-all", "css"] as const, avoid: "button" },
  };
  await html2pdf().set(opt).from(element).save();
}
