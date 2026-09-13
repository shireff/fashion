import { useTranslations } from "next-intl";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Privacy Policy | Fashion - سياسة الخصوصية",
    description: "Privacy policy and data protection information for Fashion online store - سياسة الخصوصية وحماية البيانات لمتجر فاشون",
    robots: "index, follow",
  };
}

export default function PrivacyPage() {
  const t = useTranslations("privacy");

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

          {/* Data Collection */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("dataCollection.title")}</h2>
            <p>{t("dataCollection.content")}</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>{t("dataCollection.items.personal")}</li>
              <li>{t("dataCollection.items.contact")}</li>
              <li>{t("dataCollection.items.shipping")}</li>
              <li>{t("dataCollection.items.payment")}</li>
            </ul>
          </section>

          {/* How We Use Data */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("dataUse.title")}</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>{t("dataUse.items.processing")}</li>
              <li>{t("dataUse.items.communication")}</li>
              <li>{t("dataUse.items.improvement")}</li>
              <li>{t("dataUse.items.security")}</li>
            </ul>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("dataProtection.title")}</h2>
            <p>{t("dataProtection.content")}</p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("rights.title")}</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>{t("rights.items.access")}</li>
              <li>{t("rights.items.correction")}</li>
              <li>{t("rights.items.deletion")}</li>
              <li>{t("rights.items.objection")}</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t("cookies.title")}</h2>
            <p>{t("cookies.content")}</p>
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
