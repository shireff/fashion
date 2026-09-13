"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProductsQuery } from "@/store/api/productsApi";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/skeletons";
import { ErrorState } from "@/components/ui/error-state";
import { useAppDispatch } from "@/store";
import { addItem } from "@/store/slices/cartSlice";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const tCommon = useTranslations("common");
  const tProduct = useTranslations("product");
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const categoryId = searchParams.get("category") || undefined;

  const { data, isLoading, error } = useGetProductsQuery(categoryId ? { categoryId } : undefined);

  const handleAddToCart = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      router.push(`/products/${product._id}`);
      return;
    }
    dispatch(addItem({ product, quantity: 1 }));
  };

  if (error) {
    return (
      <div className="container mx-auto px-6 py-20">
        <ErrorState
          title={tProduct("error")}
          message={tProduct("errorLoadingProducts")}
          onRetry={() => window.location.reload()}
          retryLabel={tProduct("tryAgain")}
          homeLabel={tProduct("backToHome")}
        />
      </div>
    );
  }

  const products = data?.data?.products || [];

  return (
    <div className="container mx-auto px-6 py-20">
      <h1 className="text-5xl font-bold mb-12">{tCommon("products")}</h1>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          {tCommon("noProducts")}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
