import { OrderWizardData } from "../../../hooks/orders/useOrderWizard";

export function ExtractedReview({ data }: { data: OrderWizardData }) {
  const payload = {
    workOrder: "WO-2025-XXX",
    description: data.description ?? "",
    count: data.count ?? 1,
    mirror: data.mirror,
    frame: data.frame,
    lightThread: data.lightThread,
    backLight: data.backLight,
    mirrorModule: data.mirrorModule,
    zoom: data.zoom,
    sandblast: data.sandblast,
    thickness: data.thickness,
    height: data.height,
    width: data.width,
    cornerBend: data.cornerBend,
    customer: data.customer,
    cutter: data.cutter,
    startDate: data.startDate,
    endDate: data.endDate,
    status: data.status,
    price: 0,
  };

  return (
    <div className="rounded-md border border-border bg-layer px-4 py-3 text-xs text-muted-foreground">
      <pre className="whitespace-pre-wrap break-words">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
}

