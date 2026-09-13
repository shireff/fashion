"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Plus, Trash2, Star } from "lucide-react";
import { useAppSelector } from "@/store";
import { useGetAddressesQuery, useDeleteAddressMutation, useSetDefaultAddressMutation } from "@/store/api/addressesApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { AddressCardSkeleton } from "@/components/skeletons";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import type { Address } from "@/types/address";

export default function AddressesPage() {
  const t = useTranslations("address");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const { data, isLoading, error } = useGetAddressesQuery(undefined, {
    skip: !user,
  });
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;

    try {
      await deleteAddress(id).unwrap();
    } catch (err) {
      alert(getErrorMessage(err as never, tCommon("error")));
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id).unwrap();
    } catch (err) {
      alert(getErrorMessage(err as never, tCommon("error")));
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
              <p className="text-gray-600">إدارة عناوين الشحن الخاصة بك</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-700">
              <Link href="/account/addresses/new">
                <Plus className="w-5 h-5 ml-2" />
                {t("addNew")}
              </Link>
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <AddressCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 py-20">
          <ErrorState
            title={tCommon("error")}
            message={getErrorMessage(error as never, t("errorLoadingAddresses"))}
            onRetry={() => window.location.reload()}
            retryLabel={tCommon("tryAgain")}
            homeLabel={tCommon("backHome")}
          />
        </div>
      </div>
    );
  }

  const addresses: Address[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data && typeof data.data === 'object' && 'addresses' in data.data)
      ? (data.data as { addresses: Address[] }).addresses
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
            <p className="text-gray-600">إدارة عناوين الشحن الخاصة بك</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
            <Link href="/account/addresses/new">
              <Plus className="w-5 h-5 ml-2" />
              {t("addNew")}
            </Link>
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <EmptyState
              icon={MapPin}
              title={t("noAddresses")}
              description={t("noAddressesDescription")}
              actionLabel={t("addNew")}
              actionHref="/account/addresses/new"
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((address: Address) => (
              <div
                key={address._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div className={`h-1 ${address.isDefault ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-gray-200'}`} />

                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{address.recipientName}</h3>
                      {address.isDefault && (
                        <Badge className="mt-2 bg-purple-100 text-purple-700 hover:bg-purple-100">
                          <Star className="w-3 h-3 ml-1 fill-current" />
                          {t("default")}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-gray-400" />
                      <span className="flex-1">{address.streetAddress}</span>
                    </p>

                    {address.buildingNumber && (
                      <p className="text-sm mr-6">{t("building")}: {address.buildingNumber}</p>
                    )}

                    {address.floorNumber && (
                      <p className="text-sm mr-6">{t("floor")}: {address.floorNumber}</p>
                    )}

                    {address.apartmentNumber && (
                      <p className="text-sm mr-6">{t("apartment")}: {address.apartmentNumber}</p>
                    )}

                    <p className="font-medium text-gray-900">
                      {address.area}, {address.city}, {address.governorate}
                    </p>

                    <p className="font-medium text-gray-900">{address.recipientPhone}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    {!address.isDefault && (
                      <Button
                        onClick={() => handleSetDefault(address._id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <Star className="w-4 h-4 ml-1" />
                        {t("setAsDefault")}
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(address._id)}
                      variant="outline"
                      size="sm"
                      className={`${address.isDefault ? 'flex-1' : ''} border-red-200 text-red-600 hover:bg-red-50`}
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
    </div>
  );
}
