"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { PageTitle } from "../../components/ui/typography";

export default function PricingPage() {
  return (
    <section className="flex flex-1 flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-2">
        <PageTitle>کنسول قیمت‌گذاری</PageTitle>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قیمت‌گذاری</CardTitle>
          <CardDescription>
            این بخش پس از آماده شدن نقاط پایانی قیمت‌گذاری و داده‌های حسابداری پیاده‌سازی خواهد شد.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            اجرای قیمت‌گذاری، انتخاب سفارش و ورقه حسابداری، و نمایش جزئیات مؤلفه‌ها و مجموع پیشنهادی در اینجا قرار خواهد گرفت.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
