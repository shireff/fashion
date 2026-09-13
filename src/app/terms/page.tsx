import { useTranslations } from "next-intl";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terms & Conditions | Fashion - الشروط والأحكام",
    description: "Terms and conditions for using Fashion online store - شروط وأحكام استخدام متجر فاشون",
    robots: "index, follow",
  };
}

export default function TermsPage() {
  const t = useTranslations("terms");

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8">{t("title")}</h1>

        <div className="prose prose-lg max-w-none space-y-8 text-gray-700 leading-relaxed">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("intro.title")}</h2>
            <p>{t("intro.content")}</p>
          </section>

          {/* Account */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("account.title")}</h2>
            <p>{t("account.content")}</p>
          </section>

          {/* Orders */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("orders.title")}</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>{t("orders.items.placement")}</li>
              <li>{t("orders.items.confirmation")}</li>
              <li>{t("orders.items.cancellation")}</li>
              <li>{t("orders.items.modification")}</li>
            </ul>
          </section>

          {/* Pricing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("pricing.title")}</h2>
            <p>{t("pricing.content")}</p>
          </section>

          {/* Shipping */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("shipping.title")}</h2>
            <p>{t("shipping.content")}</p>
          </section>

          {/* Returns */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("returns.title")}</h2>
            <p>{t("returns.content")}</p>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("payment.title")}</h2>
            <p>{t("payment.content")}</p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("intellectual.title")}</h2>
            <p>{t("intellectual.content")}</p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("liability.title")}</h2>
            <p>{t("liability.content")}</p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("changes.title")}</h2>
            <p>{t("changes.content")}</p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("contact.title")}</h2>
            <p>{t("contact.content")}</p>
          </section>

          {/* Last Updated */}
          <section className="pt-8 border-t">
            <p className="text-sm text-gray-500">{t("lastUpdated")}: {new Date().toLocaleDateString("ar-EG")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
