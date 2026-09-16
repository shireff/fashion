"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Truck, Edit, Trash2, MapPin } from "lucide-react";
import {
  useGetShippingZonesQuery,
  useDeleteShippingZoneMutation,
} from "@/store/api/shippingApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ShippingManagementPage() {
  const t = useTranslations("admin");
  const tCommon = useTranslations("common");

  const { data, isLoading, error } = useGetShippingZonesQuery();
  const [deleteZone] = useDeleteShippingZoneMutation();

  const zones = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.zones)
      ? data.data.zones
      : [];

  const handleDelete = async (id: string, governorate: string) => {
    if (!confirm(`هل أنت متأكد من حذف تسعيرة شحن "${governorate}"؟`)) return;

    try {
      await deleteZone(id).unwrap();
    } catch (err) {
      alert("فشل حذف التسعيرة");
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
            إضافة محافظة
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ في تحميل البيانات</h2>
        <p className="text-gray-600 mb-6">حدث خطأ أثناء تحميل تسعيرات الشحن</p>
        <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
      </div>
    );
  }

  return (
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
            إضافة محافظة
          </Link>
        </Button>
      </div>

      {/* Empty State */}
      {zones.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 mb-6">
            <Truck className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">لا توجد تسعيرات شحن</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            ابدأ بإضافة تسعيرات الشحن للمحافظات المختلفة لتمكين حساب تكلفة الشحن تلقائياً
          </p>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-700">
            <Link href="/admin/dashboard/shipping/new">
              <Plus className="w-5 h-5 ml-2" />
              إضافة محافظة جديدة
            </Link>
          </Button>
        </div>
      ) : (
        /* Zones Grid */
        <div className="grid gap-4">
          {zones.map((zone: any) => (
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
                        {zone.cities?.length || 0} مدينة
                      </p>
                    </div>
                  </div>

                  {zone.isActive ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      نشط
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                      غير نشط
                    </Badge>
                  )}
                </div>

                {/* Cities */}
                {zone.cities && zone.cities.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {zone.cities.slice(0, 4).map((city: any, index: number) => (
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
                        + {zone.cities.length - 4} مدن أخرى
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
                      تعديل
                    </Link>
                  </Button>
                  <Button
                    onClick={() => handleDelete(zone._id, zone.governorate)}
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    حذف
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
