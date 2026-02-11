"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { PageTitle, SectionSubtitle, SectionTitle, BodyText } from "../../../components/ui/typography";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { CustomSelect } from "../../../components/ui/custom-select";
import { Button } from "../../../components/ui/button";
import { useToast } from "../../../components/ui/feedback/ToastProvider";
import { useCreateUser } from "../../../hooks/api/useUsers";
import type { UserRole } from "../../../lib/api/users";

export default function NewUserPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const createUser = useCreateUser();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = "نام کاربر الزامی است.";
    }

    if (!phone.trim()) {
      nextErrors.phone = "شماره تماس الزامی است.";
    }

    if (!role) {
      nextErrors.role = "انتخاب نقش الزامی است.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      addToast({
        title: "اعتبارسنجی ناموفق",
        description: "لطفاً فیلدهای مشخص‌شده را تکمیل کنید.",
        variant: "error",
      });
      return;
    }

    try {
      await createUser.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim() || undefined,
        role: role as UserRole,
      });

      addToast({
        title: "کاربر ایجاد شد",
        description: "کاربر جدید با موفقیت به سیستم اضافه شد.",
        variant: "success",
      });

      // Stay on the same page and reset the form so
      // کاربر can create another one quickly.
      setName("");
      setPhone("");
      setAddress("");
      setRole("");
      setErrors({});
    } catch (error) {
      addToast({
        title: "خطا در ایجاد کاربر",
        description:
          error instanceof Error ? error.message : "مشکلی در ایجاد کاربر رخ داد. لطفاً دوباره تلاش کنید.",
        variant: "error",
      });
    }
  };

  const isSubmitting = createUser.isPending;
  const isDirty = name.trim() !== "" || phone.trim() !== "" || address.trim() !== "" || !!role;

  return (
    <section className="flex flex-1 flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-2">
        <PageTitle>ایجاد کاربر جدید</PageTitle>
        <SectionSubtitle>
          افزودن مشتری یا برشکار جدید برای استفاده در سفارش‌ها و سایر بخش‌ها.
        </SectionSubtitle>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle as="h3">اطلاعات کاربر</SectionTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="user-name" requiredMarker>
                نام
              </Label>
              <Input
                id="user-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.name;
                    return next;
                  });
                }}
                placeholder="مثلاً: علی رضایی"
              />
              {errors.name && (
                <BodyText className="text-xs text-red-500">{errors.name}</BodyText>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="user-phone" requiredMarker>
                شماره تماس
              </Label>
              <Input
                id="user-phone"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.phone;
                    return next;
                  });
                }}
                placeholder="مثلاً: 0912xxxxxxx"
              />
              {errors.phone && (
                <BodyText className="text-xs text-red-500">{errors.phone}</BodyText>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="user-address">آدرس (اختیاری)</Label>
            <Textarea
              id="user-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="آدرس کامل مشتری یا برشکار را وارد کنید."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex flex-col gap-2 max-w-xs">
            <Label htmlFor="user-role" requiredMarker>
              نقش
            </Label>
            <CustomSelect
              value={role || ""}
              onChange={(value) => {
                setRole(value as UserRole);
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.role;
                  return next;
                });
              }}
              options={[
                { value: "CUSTOMER", label: "مشتری" },
                { value: "CUTTER", label: "برشکار" },
              ]}
              placeholder="انتخاب نقش"
            />
            {errors.role && (
              <BodyText className="text-xs text-red-500">{errors.role}</BodyText>
            )}
          </div>

          <div className="flex justify-start gap-3 pt-4 border-t border-border">
            <Button
              variant="ghost"
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={handleSubmit}
              disabled={!isDirty || isSubmitting}
            >
              {isSubmitting ? "در حال ثبت..." : "ایجاد کاربر"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

