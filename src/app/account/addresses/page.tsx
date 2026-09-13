"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Plus } from "lucide-react";
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

  // Redirect if not logged in
  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold">{t("title")}</h1>
          <Button asChild>
            <Link href="/account/addresses/new">
              <Plus className="w-5 h-5 mr-2" />
              {t("addNew")}
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <AddressCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-20">
        <ErrorState
          title={tCommon("error")}
          message={getErrorMessage(error as never, t("errorLoadingAddresses"))}
          onRetry={() => window.location.reload()}
          retryLabel={tCommon("tryAgain")}
          homeLabel={tCommon("backHome")}
        />
      </div>
    );
  }

  const addresses: Address[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data && typeof data.data === 'object' && 'addresses' in data.data)
      ? (data.data as { addresses: Address[] }).addresses
      : [];

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-bold">{t("title")}</h1>
        <Button asChild>
          <Link href="/account/addresses/new">
            <Plus className="w-5 h-5 mr-2" />
            {t("addNew")}
          </Link>
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title={t("noAddresses")}
          description={t("noAddressesDescription")}
          actionLabel={t("addNew")}
          actionHref="/account/addresses/new"
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address: Address) => (
            <div
              key={address._id}
              className="border rounded-lg p-6 space-y-4 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{address.recipientName}</p>
                  {address.isDefault && (
                    <Badge className="mt-2">{t("default")}</Badge>
                  )}
                </div>
              </div>

              <div className="text-gray-600 space-y-1">
                <p>{address.streetAddress}</p>
                {address.buildingNumber && (
                  <p className="text-sm">{t("building")}: {address.buildingNumber}</p>
                )}
                {address.floorNumber && (
                  <p className="text-sm">{t("floor")}: {address.floorNumber}</p>
                )}
                {address.apartmentNumber && (
                  <p className="text-sm">{t("apartment")}: {address.apartmentNumber}</p>
                )}
                <p className="font-medium">
                  {address.area}, {address.city}, {address.governorate}
                </p>
                <p className="font-medium text-gray-900">{address.recipientPhone}</p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                {!address.isDefault && (
                  <Button
                    onClick={() => handleSetDefault(address._id)}
                    variant="outline"
                    size="sm"
                  >
                    {t("setAsDefault")}
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(address._id)}
                  variant="destructive"
                  size="sm"
                >
                  {tCommon("delete")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
