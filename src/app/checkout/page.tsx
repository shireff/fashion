"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store";
import { clearCart } from "@/store/slices/cartSlice";
import { useGetAddressesQuery } from "@/store/api/addressesApi";
import { useCreateOrderMutation } from "@/store/api/ordersApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AddressCardSkeleton } from "@/components/skeletons";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { getLocalizedText } from "@/lib/utils/bilingual";
import type { Address } from "@/types/address";
import { ErrorModal } from "@/components/ui/error-modal";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const tCommon = useTranslations("common");
  const locale = useLocale() as "ar" | "en";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const { data: addressesData, isLoading: addressesLoading } = useGetAddressesQuery(undefined, {
    skip: !user,
  });
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const addresses: Address[] = useMemo(() => {
    if (Array.isArray(addressesData?.data)) {
      return addressesData.data;
    }
    if (addressesData?.data && typeof addressesData.data === 'object' && 'addresses' in addressesData.data) {
      return (addressesData.data as { addresses: Address[] }).addresses;
    }
    return [];
  }, [addressesData]);

  const computedSelectedAddress = useMemo(() => {
    if (addresses.length === 0) return "";
    const defaultAddr = addresses.find((addr) => addr.isDefault);
    return defaultAddr ? defaultAddr._id : addresses[0]._id;
  }, [addresses]);

  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const effectiveSelectedAddress = selectedAddress || computedSelectedAddress;

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      router.push("/cart");
      return;
    }
  }, [user, items, router]);

  if (!user || items.length === 0) {
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!effectiveSelectedAddress) {
      setErrorModal({
        isOpen: true,
        title: tCommon("error"),
        message: t("selectAddress"),
      });
      return;
    }

    try {
      const selectedAddressObj = addresses.find((addr) => addr._id === effectiveSelectedAddress);

      if (!selectedAddressObj) {
        setErrorModal({
          isOpen: true,
          title: tCommon("error"),
          message: t("selectAddress"),
        });
        return;
      }

      const orderItems = items.map((item) => ({
        productId: item.product._id,
        variantSku: item.variantId || item.product.sku || "DEFAULT-SKU",
        quantity: item.quantity,
      }));

      await createOrder({
        items: orderItems,
        shippingAddress: {
          recipientName: selectedAddressObj.recipientName,
          recipientPhone: selectedAddressObj.recipientPhone,
          governorate: selectedAddressObj.governorate,
          city: selectedAddressObj.city,
          area: selectedAddressObj.area || "",
          streetAddress: selectedAddressObj.streetAddress,
          buildingNumber: selectedAddressObj.buildingNumber || "",
          floorNumber: selectedAddressObj.floorNumber || "",
          apartmentNumber: selectedAddressObj.apartmentNumber || "",
          landmark: selectedAddressObj.landmark || "",
        },
        notes,
      }).unwrap();

      dispatch(clearCart());
      router.push("/orders");
    } catch (err) {
      setErrorModal({
        isOpen: true,
        title: tCommon("error"),
        message: getErrorMessage(err as never, tCommon("error")),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-gray-600">أكمل طلبك وسنوصله لك في أسرع وقت</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t("shippingAddress")}
                </h2>
              </div>

              <div className="p-6">
                {addressesLoading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <AddressCardSkeleton key={i} />
                    ))}
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-600">{t("noAddresses")}</p>
                    <Button onClick={() => router.push("/account/addresses/new")} className="bg-gray-900 hover:bg-gray-800">
                      {t("addNewAddress")}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address: Address) => (
                      <button
                        key={address._id}
                        onClick={() => setSelectedAddress(address._id)}
                        className={`w-full p-5 rounded-xl text-right transition-all duration-200 ${effectiveSelectedAddress === address._id
                            ? "bg-gray-900 text-white shadow-lg ring-2 ring-gray-900 ring-offset-2"
                            : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className={`font-bold text-lg mb-2 ${effectiveSelectedAddress === address._id ? "text-white" : "text-gray-900"}`}>
                              {address.recipientName}
                            </div>
                            <div className={`space-y-1 text-sm ${effectiveSelectedAddress === address._id ? "text-gray-200" : "text-gray-600"}`}>
                              <p>{address.streetAddress}</p>
                              <p>{address.area}, {address.city}, {address.governorate}</p>
                              <p className="font-medium">{address.recipientPhone}</p>
                            </div>
                          </div>
                          {effectiveSelectedAddress === address._id && (
                            <div className="mr-3">
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => router.push("/account/addresses/new")}
                      className="w-full border-2 border-dashed border-gray-300 hover:border-gray-900 hover:bg-gray-50"
                    >
                      + {t("addNewAddress")}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Notes Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  {t("orderNotes")}
                </h2>
              </div>
              <div className="p-6">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("orderNotesPlaceholder")}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          </div>

          {/* Order Summary Sticky Card */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{t("orderSummary")}</h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.product._id}-${item.variantId || "default"}`} className="flex justify-between items-center text-sm pb-3 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700 flex-1">
                        {getLocalizedText(item.product.name, locale)}
                        <span className="text-purple-600 font-medium"> x{item.quantity}</span>
                      </span>
                      <span className="font-bold text-gray-900">
                        {item.product.price * item.quantity} {tCommon("currency")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 py-4 border-y border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>{tCart("subtotal")}</span>
                    <span className="font-semibold">{totalAmount} {tCommon("currency")}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>{tCart("shipping")}</span>
                    <span className="font-semibold text-purple-600">{tCart("calculated")}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xl font-bold bg-gray-50 -mx-6 -mb-6 px-6 py-5">
                  <span className="text-gray-900">{tCart("total")}</span>
                  <span className="text-purple-600">{totalAmount} {tCommon("currency")}</span>
                </div>
              </div>

              <div className="px-6 pb-6 -mt-3">
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isLoading || !effectiveSelectedAddress}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg font-bold py-6"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {tCommon("loading")}
                    </span>
                  ) : (
                    t("placeOrder")
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, title: "", message: "" })}
        title={errorModal.title}
        message={errorModal.message}
      />
    </div>
  );
}
