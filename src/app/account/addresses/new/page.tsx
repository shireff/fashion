"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store";
import { useCreateAddressMutation } from "@/store/api/addressesApi";
import { AddressLabel } from "@/lib/api/endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/utils/errorHandler";

export default function NewAddressPage() {
  const t = useTranslations("address");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const [createAddress, { isLoading }] = useCreateAddressMutation();

  const [formData, setFormData] = useState({
    label: AddressLabel.HOME,
    recipientName: "",
    recipientPhone: "",
    governorate: "",
    city: "",
    area: "",
    streetAddress: "",
    buildingNumber: "",
    floorNumber: "",
    apartmentNumber: "",
    landmark: "",
    isDefault: false,
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createAddress(formData).unwrap();
      router.push("/account/addresses");
    } catch (err) {
      alert(getErrorMessage(err as never, tCommon("error")));
    }
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-12">{t("addNew")}</h1>

      <Card className="max-w-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="recipientName">{t("recipientName")}</Label>
              <Input
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientPhone">{t("recipientPhone")}</Label>
              <Input
                id="recipientPhone"
                name="recipientPhone"
                type="tel"
                value={formData.recipientPhone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="governorate">{t("governorate")}</Label>
              <Input
                id="governorate"
                name="governorate"
                value={formData.governorate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">{t("city")}</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">{t("area")}</Label>
              <Input
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="streetAddress">{t("streetAddress")}</Label>
            <Input
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="buildingNumber">{t("buildingNumber")}</Label>
              <Input
                id="buildingNumber"
                name="buildingNumber"
                value={formData.buildingNumber}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floorNumber">{t("floorNumber")}</Label>
              <Input
                id="floorNumber"
                name="floorNumber"
                value={formData.floorNumber}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apartmentNumber">{t("apartmentNumber")}</Label>
              <Input
                id="apartmentNumber"
                name="apartmentNumber"
                value={formData.apartmentNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="landmark">{t("landmark")}</Label>
            <Input
              id="landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <Label htmlFor="isDefault" className="cursor-pointer">
              {t("setAsDefault")}
            </Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? tCommon("loading") : tCommon("save")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              {tCommon("cancel")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
