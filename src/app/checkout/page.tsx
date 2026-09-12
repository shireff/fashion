"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store";
import { clearCart } from "@/store/slices/cartSlice";
import { useGetAddressesQuery } from "@/store/api/addressesApi";
import { useCreateOrderMutation } from "@/store/api/ordersApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AddressCardSkeleton } from "@/components/skeletons";
import { getErrorMessage } from "@/lib/utils/errorHandler";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [notes, setNotes] = useState("");

  const { data: addressesData, isLoading: addressesLoading } = useGetAddressesQuery(undefined, {
    skip: !user,
  });
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const addresses = addressesData?.data || [];

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

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((addr) => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr._id);
      } else {
        setSelectedAddress(addresses[0]._id);
      }
    }
  }, [addresses, selectedAddress]);

  if (!user || items.length === 0) {
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert(t("selectAddress"));
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        product: item.product._id,
        variant: item.variantId,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await createOrder({
        items: orderItems,
        shippingAddress: selectedAddress,
        notes,
      }).unwrap();

      dispatch(clearCart());
      router.push("/orders");
    } catch (err) {
      alert(getErrorMessage(err as never, tCommon("error")));
    }
  };

  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-12">{t("title")}</h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div>
            <h2 className="text-2xl font-bold mb-6">{t("shippingAddress")}</h2>
            {addressesLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <AddressCardSkeleton key={i} />
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <div className="p-6 border border-dashed rounded text-center space-y-4">
                <p className="text-gray-600">{t("noAddresses")}</p>
                <Button onClick={() => router.push("/account/addresses/new")}>
                  {t("addNewAddress")}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <button
                    key={address._id}
                    onClick={() => setSelectedAddress(address._id)}
                    className={`w-full p-6 border-2 text-left rounded transition-colors ${selectedAddress === address._id
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="font-bold mb-2">{address.recipientName}</div>
                    <div className="text-gray-600 space-y-1">
                      <p>{address.streetAddress}</p>
                      <p>
                        {address.area}, {address.city}, {address.governorate}
                      </p>
                      <p>{address.recipientPhone}</p>
                    </div>
                  </button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => router.push("/account/addresses/new")}
                  className="w-full"
                >
                  {t("addNewAddress")}
                </Button>
              </div>
            )}
          </div>

          {/* Order Notes */}
          <div>
            <h2 className="text-2xl font-bold mb-6">{t("orderNotes")}</h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("orderNotesPlaceholder")}
              rows={4}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{t("orderSummary")}</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.product._id}-${item.variantId || "default"}`} className="flex justify-between text-sm">
                  <span>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    {item.product.price * item.quantity} {tCommon("currency")}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4 py-6 border-y">
              <div className="flex justify-between">
                <span>{tCart("subtotal")}</span>
                <span className="font-bold">
                  {totalAmount} {tCommon("currency")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{tCart("shipping")}</span>
                <span className="font-bold">{tCart("calculated")}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold">
              <span>{tCart("total")}</span>
              <span>
                {totalAmount} {tCommon("currency")}
              </span>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={isLoading || !selectedAddress}
              size="lg"
              className="w-full"
            >
              {isLoading ? tCommon("loading") : t("placeOrder")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
