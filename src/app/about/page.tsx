"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Shield, Truck, Award } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");
  const tCommon = useTranslations("common");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              {t("title", { siteName: tCommon("siteName") })}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">{t("ourStory")}</h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>{t("storyParagraph1", { siteName: tCommon("siteName") })}</p>
              <p>{t("storyParagraph2")}</p>
              <p>{t("storyParagraph3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">
            {t("whyChooseUs", { siteName: tCommon("siteName") })}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("highQuality")}</h3>
              <p className="text-gray-600">{t("highQualityDesc")}</p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-6">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("fastShipping")}</h3>
              <p className="text-gray-600">{t("fastShippingDesc")}</p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-600 mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("excellentService")}</h3>
              <p className="text-gray-600">{t("excellentServiceDesc")}</p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-600 mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("securePayment")}</h3>
              <p className="text-gray-600">{t("securePaymentDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            {t("startJourney")}
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            {t("startJourneyDesc")}
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all">
            <Link href="/products" className="flex items-center gap-2">
              {tCommon("products")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
