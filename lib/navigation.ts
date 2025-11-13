export const NAV_SECTIONS = [
  {
    label: "Catalog",
    items: [
      { label: "Mirrors", href: "/catalog/mirrors" },
      { label: "Shapes", href: "/catalog/shapes" },
      { label: "Feature Modules", href: "/catalog/features" },
      { label: "Accounting Tables", href: "/catalog/accounting" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Orders", href: "/orders" },
      { label: "Pricing", href: "/pricing" },
      { label: "Tools & Reporting", href: "/tools" },
      { label: "Media Gallery", href: "/media" },
    ],
  },
] as const;

export type NavSection = (typeof NAV_SECTIONS)[number];

