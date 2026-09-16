"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Truck, Edit, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  useGetShippingZonesQuery,
  useDeleteShippingZoneMutation,
} from "@/store/api/shippingApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface ShippingZone {
  _id: string;
  governorate: string;
  cities: Array<{ name: string; shippingFee: number }>;
  isActive: boolean;
}

export default function ShippingManagementPage() {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");

  const { data, isLoading, error } = useGetShippingZonesQuery();
  const [deleteZone, { isLoading: isDeleting }] = useDeleteShippingZoneMutation();

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; zone: ShippingZone | null }>({
    open: false,
    zone: null,
  });

  const zones: ShippingZone[] = (() => {
    if (!data?.data) return [];
    if (Array.isArray(data.data)) return data.data;
    const dataWithZones = data.data as unknown as { zones?: ShippingZone[] };
    return Array.isArray(dataWithZones.zones) ? dataWithZones.zones : [];
  })();

  const handleDeleteClick = (zone: ShippingZone) => {
    setDeleteDialog({ open: true, zone });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.zone) return;

    try {
      await deleteZone(deleteDialog.zone._id).unwrap();
      toast.success(t("shippingDeleted"));
      setDeleteDialog({ open: false, zone: null });
    } catch {
      toast.error(t("shippingDeleteFailed"));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("shippingManagement")}</h1>
            <p className="text-gray-600 mt-2">{t("shippingDescription")}</p>
          </div>
          <Button disabled className="bg-gradient-to-r from-purple-600 to-purple-700">
            <Plus className="w-5 h-5 ml-2" />
            {t("addGovernorate")}
          </Button>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <Truck className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("errorLoadingData")}</h2>
        <p className="text-gray-600 mb-6">{t("shippingDescription")}</p>
        <Button onClick={() => window.location.reload()}>{tCommon("tryAgain")}</Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("shippingManagement")}</h1>
            <p className="text-gray-600 mt-2">{t("shippingDescription")}</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all">
            <Link href="/admin/dashboard/shipping/new">
              <Plus className="w-5 h-5 ml-2" />
              {t("addGovernorate")}
            </Link>
          </Button>
        </div>

        {/* Empty State */}
        {zones.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 mb-6">
              <Truck className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("noShippingZones")}</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t("noShippingZonesDescription")}
            </p>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-700">
              <Link href="/admin/dashboard/shipping/new">
                <Plus className="w-5 h-5 ml-2" />
                {t("addGovernorate")}
              </Link>
            </Button>
          </div>
        ) : (
          /* Zones Grid */
          <div className="grid gap-4">
            {zones.map((zone) => (
              <div
                key={zone._id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                {/* Header Bar */}
                <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{zone.governorate}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {zone.cities?.length || 0} {t("citiesCount")}
                        </p>
                      </div>
                    </div>

                    {zone.isActive ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {t("active")}
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                        {t("inactive")}
                      </Badge>
                    )}
                  </div>

                  {/* Cities */}
                  {zone.cities && zone.cities.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {zone.cities.slice(0, 4).map((city, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="text-sm font-medium text-gray-700">{city.name}</span>
                            <span className="text-sm font-bold text-purple-600">
                              {city.shippingFee} {tCommon("currency")}
                            </span>
                          </div>
                        ))}
                      </div>
                      {zone.cities.length > 4 && (
                        <p className="text-sm text-gray-500 mt-2">
                          + {zone.cities.length - 4} {t("citiesCount")}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Link href={`/admin/dashboard/shipping/${zone._id}/edit`}>
                        <Edit className="w-4 h-4 ml-1" />
                        {tCommon("edit")}
                      </Link>
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(zone)}
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4 ml-1" />
                      {tCommon("delete")}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open: boolean) => !isDeleting && setDeleteDialog({ open, zone: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteShipping")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmDeleteShipping", { governorate: deleteDialog.zone?.governorate || "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? tCommon("loading") : tCommon("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
