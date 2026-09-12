"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store";
import { useGetAddressesQuery, useDeleteAddressMutation, useSetDefaultAddressMutation } from "@/store/api/addressesApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddressCardSkeleton } from "@/components/skeletons";
import { getErrorMessage } from "@/lib/utils/errorHandler";

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
      <div className="container mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold">{t("title")}</h1>
          <Button asChild>
            <Link href="/account/addresses/new">{t("addNew")}</Link>
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
        <div className="text-center text-red-600">{tCommon("error")}</div>
      </div>
    );
  }

  const addresses = data?.data || [];

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-5xl font-bold">{t("title")}</h1>
        <Button asChild>
          <Link href="/account/addresses/new">{t("addNew")}</Link>
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center space-y-6">
          <p className="text-xl text-gray-600">{t("noAddresses")}</p>
          <Button asChild>
            <Link href="/account/addresses/new">{t("addNew")}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address._id} className="border rounded-lg p-6 space-y-4">
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
                {address.buildingNumber && <p>{t("building")}: {address.buildingNumber}</p>}
                {address.floorNumber && <p>{t("floor")}: {address.floorNumber}</p>}
                {address.apartmentNumber && <p>{t("apartment")}: {address.apartmentNumber}</p>}
                <p>
                  {address.area}, {address.city}, {address.governorate}
                </p>
                <p>{address.recipientPhone}</p>
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
