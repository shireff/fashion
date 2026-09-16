"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGetProductsQuery } from "@/store/api/productsApi";
import { useGetCategoriesQuery } from "@/store/api/categoriesApi";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/skeletons";
import { useAppDispatch } from "@/store";
import { addItem } from "@/store/slices/cartSlice";
import type { Product } from "@/types/product";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

export default function HomePage() {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({ limit: 8, isFeatured: true });
  const { data: categoriesData } = useGetCategoriesQuery({ level: 1, limit: 6 });

  const featuredProducts = productsData?.data?.products || [];
  const categories = categoriesData?.data?.categories || [];

  const handleAddToCart = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      router.push(`/products/${product._id}`);
      return;
    }
    dispatch(addItem({ product, quantity: 1 }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Modern & Bold */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="container mx-auto px-6 py-32 md:py-40">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              {t("heroSubtitle") || "اكتشف أحدث صيحات الموضة"}
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              {t("heroTitle") || "موضة عصرية لكل المناسبات"}
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              {t("heroDescription") || "تسوق من تشكيلة واسعة من الأزياء العصرية والإكسسوارات الفريدة"}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-7 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all">
                <Link href="/products" className="flex items-center gap-2">
                  {t("shopNow") || "تسوق الآن"}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-7 rounded-full">
                <Link href="#categories">{t("browseCategories") || "تصفح الفئات"}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </section>

      {/* Categories Grid - Modern Cards */}
      {categories.length > 0 && (
        <section id="categories" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4">{t("shopByCategory") || "تسوق حسب الفئة"}</h2>
              <p className="text-xl text-gray-600">{t("exploreCategories") || "اكتشف تشكيلتنا المتنوعة"}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const categoryName = typeof category.name === "string"
                  ? category.name
                  : (category.name as any)?.[locale] || (category.name as any)?.ar || "";

                return (
                  <Link
                    key={category._id}
                    href={`/products?category=${category._id}`}
                    className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-purple-300 hover:shadow-lg"
                  >
                    {/* Category Name */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {categoryName}
                    </h3>

                    {/* CTA */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 group-hover:text-purple-600 transition-colors">
                      <span>استكشف الآن</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform" />
                    </div>

                    {/* Minimal Accent Line */}
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products - Modern Grid */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-indigo-600" />
                <span className="text-lg font-semibold text-indigo-600">{t("trending") || "الأكثر مبيعا"}</span>
              </div>
              <h2 className="text-5xl font-bold">{t("newArrivals") || "وصل حديثاً"}</h2>
            </div>
            <Link
              href="/products"
              className="group flex items-center gap-2 text-lg font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {t("viewAll") || "عرض الكل"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {productsLoading ? (
            <ProductGridSkeleton count={8} />
          ) : featuredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              {tCommon("noProducts") || "لا توجد منتجات"}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            {t("ctaTitle") || "جاهز للتسوق؟"}
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            {t("ctaDescription") || "اكتشف تشكيلتنا الكاملة واحصل على عروض حصرية"}
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all">
            <Link href="/products" className="flex items-center gap-2">
              {t("startShopping") || "ابدأ التسوق"}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
