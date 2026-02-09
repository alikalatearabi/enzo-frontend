export const NAV_SECTIONS = [
  {
    label: "کاتالوگ",
    items: [
      { label: "آینه‌ها", href: "/catalog/mirrors" },
      { label: "اشکال", href: "/catalog/shapes" },
      { label: "ماژول‌های ویژگی", href: "/catalog/features" },
      { label: "جداول حسابداری", href: "/catalog/accounting" },
    ],
  },
  {
    label: "عملیات",
    items: [
      { label: "سفارش‌ها", href: "/orders" },
      { label: "قیمت‌گذاری", href: "/pricing" },
      { label: "ابزارها و گزارش‌گیری", href: "/tools" },
      { label: "گالری رسانه", href: "/media" },
    ],
  },
] as const;

export type NavSection = (typeof NAV_SECTIONS)[number];

