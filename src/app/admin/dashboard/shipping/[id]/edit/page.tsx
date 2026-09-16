"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, MapPin, DollarSign } from "lucide-react";
import { toast } from "sonner";
import {
  useGetShippingZonesQuery,
  useUpdateShippingZoneMutation,
} from "@/store/api/shippingApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface City {
  name: string;
  shippingFee: number;
}

interface ShippingZone {
  _id: string;
  governorate: string;
  cities: City[];
  isActive: boolean;
}

export default function EditShippingZonePage() {
  const router = useRouter();
  const params = useParams();
  const zoneId = params.id as string;
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");

  const { data, isLoading: loadingZone } = useGetShippingZonesQuery();
  const [updateZone, { isLoading: updating }] = useUpdateShippingZoneMutation();

  // Find the zone from data (derived state)
  const zone = useMemo(() => {
    if (!data?.data) return null;
    const zones: ShippingZone[] = Array.isArray(data.data)
      ? data.data
      : (data.data as { zones?: ShippingZone[] }).zones || [];
    return zones.find((z) => z._id === zoneId) || null;
  }, [data, zoneId]);

  // Initialize form values from zone (only on first render when zone is available)
  const initialGovernorate = zone?.governorate || "";
  const initialShippingFee = zone?.cities?.[0]?.shippingFee || 50;
  const initialCitiesText = zone?.cities?.map((c) => c.name).join("\n") || "";
  const initialIsActive = zone?.isActive ?? true;

  const [governorate, setGovernorate] = useState(initialGovernorate);
  const [shippingFee, setShippingFee] = useState<number>(initialShippingFee);
  const [citiesText, setCitiesText] = useState(initialCitiesText);
  const [isActive, setIsActive] = useState(initialIsActive);

  // Update form when zone loads (only if form is still empty)
  if (zone && !governorate && initialGovernorate) {
    setGovernorate(initialGovernorate);
    setShippingFee(initialShippingFee);
    setCitiesText(initialCitiesText);
    setIsActive(initialIsActive);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!governorate.trim()) {
      toast.error(t("governorateNameRequired"));
      return;
    }

    if (shippingFee < 0) {
      toast.error(t("shippingFeeRequired"));
      return;
    }

    // Parse cities from text (comma or newline separated)
    const citiesList = citiesText
      .split(/[,\n]/)
      .map((c) => c.trim())
      .filter(Boolean);

    if (citiesList.length === 0) {
      toast.error(t("citiesListRequired"));
      return;
    }

    try {
      // All cities will have the same shipping fee
      const cities = citiesList.map((cityName) => ({
        name: cityName,
        shippingFee: shippingFee,
        areas: [],
      }));

      await updateZone({
        id: zoneId,
        data: {
          governorate: governorate.trim(),
          cities,
          isActive,
        },
      }).unwrap();

      toast.success(t("shippingUpdated"));
      router.push("/admin/dashboard/shipping");
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message;
      toast.error(errorMessage || t("shippingUpdateFailed"));
    }
  };

  if (loadingZone) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/dashboard/shipping"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowRight className="w-4 h-4 ml-1" />
          {t("backToShipping")}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{t("editShipping")}</h1>
        <p className="text-gray-600 mt-2">{t("shippingDescription")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Governorate Info */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {t("governorateInfo")}
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Governorate Name */}
            <div>
              <Label htmlFor="governorate" className="text-lg font-semibold">
                {t("governorateName")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="governorate"
                type="text"
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                placeholder={t("governorateNameRequired")}
                className="mt-2"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {t("shippingFeeNote")}
              </p>
            </div>

            {/* Shipping Fee */}
            <div>
              <Label htmlFor="shippingFee" className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                {t("shippingFee")} ({tCommon("currency")}) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shippingFee"
                type="number"
                min="0"
                step="1"
                value={shippingFee}
                onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                placeholder="50"
                className="mt-2 text-lg font-bold"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {t("shippingFeeNote")}
              </p>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <div>
                <Label htmlFor="isActive" className="font-semibold cursor-pointer">
                  {t("activateZone")}
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {t("activateZoneNote")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cities List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
            <h2 className="text-xl font-bold text-white">{t("citiesList")}</h2>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="cities" className="font-semibold">
                {t("citiesList")} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="cities"
                value={citiesText}
                onChange={(e) => setCitiesText(e.target.value)}
                placeholder={t("citiesListPlaceholder")}
                rows={8}
                className="mt-2 font-mono"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 <strong>{t("citiesListNote")}</strong>
              </p>
            </div>

            {/* Preview */}
            {citiesText.trim() && (
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">
                  {t("citiesPreview")} ({citiesText.split(/[,\n]/).filter((c) => c.trim()).length} {t("citiesCount")})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {citiesText
                    .split(/[,\n]/)
                    .map((c) => c.trim())
                    .filter(Boolean)
                    .map((city, index) => (
                      <div
                        key={index}
                        className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-gray-700 border border-purple-200"
                      >
                        {city} • {shippingFee} {tCommon("currency")}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={updating}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-lg py-6"
          >
            {updating ? t("saving") : t("saveChanges")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/dashboard/shipping")}
            className="px-8"
          >
            {tCommon("cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}
