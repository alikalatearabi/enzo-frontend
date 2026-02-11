"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../components/ui/card";
import {
  BodyText,
  PageTitle,
  SectionSubtitle,
  SectionTitle,
} from "../../components/ui/typography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useUsers } from "../../hooks/api/useUsers";
import { toPersianNumber } from "../../lib/utils/numbers";

export default function UsersPage() {
  const router = useRouter();
  const { data: users = [], isLoading, isError } = useUsers();

  const customers = useMemo(
    () => users.filter((u) => u.role === "CUSTOMER"),
    [users],
  );

  const cutters = useMemo(
    () => users.filter((u) => u.role === "CUTTER"),
    [users],
  );

  return (
    <section className="flex flex-1 flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-2">
        <PageTitle>کاربران</PageTitle>
        <SectionSubtitle>
          مدیریت مشتریان و برشکاران برای استفاده در سفارش‌ها و سایر بخش‌ها.
        </SectionSubtitle>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">فهرست کاربران</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <BodyText className="text-sm text-muted-foreground">
              در حال بارگذاری کاربران...
            </BodyText>
          )}
          {isError && !isLoading && (
            <BodyText className="text-sm text-red-500">
              خطا در دریافت فهرست کاربران.
            </BodyText>
          )}

          {!isLoading && !isError && (
            <>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>
                  مجموع کاربران: {toPersianNumber(users.length)} نفر
                </span>
                <span>
                  مشتریان: {toPersianNumber(customers.length)} نفر
                </span>
                <span>
                  برشکاران: {toPersianNumber(cutters.length)} نفر
                </span>
              </div>

              {users.length === 0 ? (
                <BodyText className="text-sm text-muted-foreground">
                  هنوز هیچ کاربری ثبت نشده است. از دکمه{" "}
                  <span className="font-medium">ایجاد کاربر جدید</span> برای افزودن اولین کاربر استفاده کنید.
                </BodyText>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>نام</TableHead>
                      <TableHead>نقش</TableHead>
                      <TableHead>شماره تماس</TableHead>
                      <TableHead>آدرس</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow key={`${user.id}-${index}`}>
                        <TableCell>
                          <span className="font-medium text-foreground">
                            {user.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="rounded-full bg-layer-hover px-2 py-1 text-xs font-medium text-muted-foreground">
                            {user.role === "CUSTOMER" ? "مشتری" : "برشکار"}
                          </span>
                        </TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.address || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          onClick={() => router.push("/users/new")}
        >
          ایجاد کاربر جدید
        </Button>
      </div>
    </section>
  );
}

