"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { siteConfig, getSocialLinks, getContactInfo } from "@/config/site";
import { Mail, Phone, MapPin } from "lucide-react";

// Custom social media icon components
const SocialIcons = {
  facebook: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  twitter: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  youtube: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

type SocialPlatform = keyof typeof SocialIcons;

export function Footer() {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");

  const socialLinks = getSocialLinks();
  const contactInfo = getContactInfo(locale);

  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {locale === "ar" ? siteConfig.nameAr : siteConfig.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {locale === "ar" ? siteConfig.descriptionAr : siteConfig.description}
            </p>
            <p className="text-xs text-gray-500">
              {siteConfig.business.companyNameAr}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t("contactUs")}</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 shrink-0" />
                <a href={`mailto:${siteConfig.contact.sharif.email}`} className="hover:text-primary transition-colors">
                  {siteConfig.contact.sharif.email}
                </a>
              </li>
              <li className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{locale === "ar" ? "أ. كرس" : "Mr. Karas"}</span>
                </div>
                <a
                  href={siteConfig.contact.karas.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors mr-6"
                  dir="ltr"
                >
                  {siteConfig.contact.karas.phoneFormatted}
                </a>
              </li>
              <li className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="font-medium">{locale === "ar" ? "أ. أفرام" : "Mr. Avram"}</span>
                </div>
                <a
                  href={siteConfig.contact.avram.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors mr-6"
                  dir="ltr"
                >
                  {siteConfig.contact.avram.phoneFormatted}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <span>{contactInfo.address}</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("quickLinks")}</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  {t("termsConditions")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">{t("followUs")}</h4>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map(({ platform, url }) => {
                const Icon = SocialIcons[platform as SocialPlatform];
                if (!Icon) return null;

                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-indigo-600 hover:text-white transition-colors"
                    aria-label={platform}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>

            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2">{t("workingHours")}</h5>
              <p className="text-xs text-gray-600">{contactInfo.workingHours}</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>
            {t("copyright", {
              year: new Date().getFullYear(),
              siteName: locale === "ar" ? siteConfig.nameAr : siteConfig.name
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
