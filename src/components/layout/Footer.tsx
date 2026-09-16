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
    <footer className="border-t bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              {locale === "ar" ? siteConfig.nameAr : siteConfig.name}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {locale === "ar" ? siteConfig.sloganAr : siteConfig.slogan}
            </p>

            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              {socialLinks.slice(0, 4).map(({ platform, url }) => {
                const Icon = SocialIcons[platform as SocialPlatform];
                if (!Icon) return null;

                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                    aria-label={platform}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t("quickLinks")}</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-purple-400 transition-colors inline-flex items-center gap-2">
                  {tCommon("home")}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-purple-400 transition-colors inline-flex items-center gap-2">
                  {tCommon("products")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-purple-400 transition-colors inline-flex items-center gap-2">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-purple-400 transition-colors inline-flex items-center gap-2">
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-purple-400 transition-colors inline-flex items-center gap-2">
                  {t("privacyPolicy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t("contactUs")}</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-purple-400" />
                <a
                  href={`mailto:${siteConfig.contact.sharif.email}`}
                  className="hover:text-purple-400 transition-colors break-all"
                >
                  {siteConfig.contact.sharif.email}
                </a>
              </li>

              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-purple-400" />
                <div className="flex flex-col gap-1">
                  <a
                    href={siteConfig.contact.karas.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-purple-400 transition-colors"
                    dir="ltr"
                  >
                    {siteConfig.contact.karas.phoneFormatted}
                  </a>
                  <a
                    href={siteConfig.contact.avram.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-purple-400 transition-colors"
                    dir="ltr"
                  >
                    {siteConfig.contact.avram.phoneFormatted}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-purple-400" />
                <span className="leading-relaxed">{contactInfo.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} {locale === "ar" ? siteConfig.nameAr : siteConfig.name}. {t("allRightsReserved")}
          </p>
          <p className="text-xs">
            {siteConfig.business.companyNameAr}
          </p>
        </div>
      </div>
    </footer>
  );
}
