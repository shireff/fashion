import type { Metadata } from "next";

/**
 * Site Configuration
 * ملف التكوين الرئيسي للموقع - يحتوي على جميع المعلومات المشتركة
 */

export const siteConfig = {
  // Basic Info
  name: "Fashion",
  nameAr: "فاشون",
  slogan: "Modern Fashion, Timeless Style",
  sloganAr: "أزياء عصرية، أناقة خالدة",
  description: "Modern fashion store offering trendy clothing and accessories for men and women",
  descriptionAr: "متجر أزياء عصري يقدم ملابس وإكسسوارات عصرية للرجال والنساء",

  // URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",

  // Images
  logo: "/logo.png",
  logoAr: "/logo-ar.png",
  ogImage: "/og-image.jpg",
  favicon: "/favicon.ico",

  // Social Media Links
  social: {
    facebook: "https://facebook.com/fashionstore",
    instagram: "https://instagram.com/fashionstore",
    twitter: "https://twitter.com/fashionstore",
    tiktok: "https://tiktok.com/@fashionstore",
    youtube: "https://youtube.com/@fashionstore",
    whatsapp: "https://wa.me/201234567890", // رقم واتساب
    telegram: "https://t.me/fashionstore",
  },

  // Contact Info
  contact: {
    email: "info@fashionstore.com",
    supportEmail: "support@fashionstore.com",
    phone: "+20 123 456 7890",
    phoneFormatted: "(+20) 123-456-7890",
    address: {
      ar: "القاهرة، مصر",
      en: "Cairo, Egypt",
    },
    addressFull: {
      ar: "١٢٣ شارع التحرير، وسط البلد، القاهرة، مصر",
      en: "123 Tahrir Street, Downtown, Cairo, Egypt",
    },
    workingHours: {
      ar: "السبت - الخميس: ١٠ص - ١٠م | الجمعة: ١٢ظ - ١٢م",
      en: "Sat - Thu: 10AM - 10PM | Fri: 12PM - 12AM",
    },
  },

  // Business Info
  business: {
    companyName: "Fashion Store LLC",
    companyNameAr: "شركة فاشون للأزياء",
    taxNumber: "123-456-789",
    commercialRegister: "987654321",
    foundedYear: 2024,
  },

  // SEO Keywords
  keywords: {
    ar: [
      "ملابس عصرية",
      "أزياء رجالية",
      "أزياء نسائية",
      "متجر إلكتروني",
      "موضة",
      "ملابس كاجوال",
      "ملابس رسمية",
      "إكسسوارات",
    ],
    en: [
      "modern fashion",
      "men's clothing",
      "women's clothing",
      "online store",
      "fashion",
      "casual wear",
      "formal wear",
      "accessories",
    ],
  },

  // App Info
  app: {
    version: "1.0.0",
    lastUpdated: "2024-01-01",
  },

  // Payment Methods
  paymentMethods: ["visa", "mastercard", "cash-on-delivery", "fawry"],

  // Shipping Info
  shipping: {
    freeShippingThreshold: 500, // جنيه
    defaultShippingFee: 50,
    estimatedDelivery: {
      ar: "٢-٥ أيام عمل",
      en: "2-5 business days",
    },
  },

  // Features
  features: {
    pwa: true,
    multiLanguage: true,
    darkMode: false,
    realTimeNotifications: true,
  },
} as const;

/**
 * Generate page metadata
 * دالة لتوليد metadata لكل صفحة
 */
export function generateMetadata({
  title,
  titleAr,
  description,
  descriptionAr,
  image,
  noIndex = false,
  locale = "ar",
  keywords,
}: {
  title?: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  noIndex?: boolean;
  locale?: "ar" | "en";
  keywords?: string[];
}): Metadata {
  const isArabic = locale === "ar";
  const pageTitle = isArabic
    ? titleAr || title || siteConfig.nameAr
    : title || titleAr || siteConfig.name;
  const pageDescription = isArabic
    ? descriptionAr || description || siteConfig.descriptionAr
    : description || descriptionAr || siteConfig.description;
  const fullTitle = pageTitle.includes(siteConfig.name)
    ? pageTitle
    : `${pageTitle} | ${isArabic ? siteConfig.nameAr : siteConfig.name}`;

  const pageKeywords = keywords || (isArabic ? siteConfig.keywords.ar : siteConfig.keywords.en);

  return {
    title: fullTitle,
    description: pageDescription,
    keywords: pageKeywords,
    authors: [{ name: siteConfig.business.companyName }],
    creator: siteConfig.business.companyName,
    publisher: siteConfig.business.companyName,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    openGraph: {
      title: fullTitle,
      description: pageDescription,
      type: "website",
      locale: isArabic ? "ar_EG" : "en_US",
      url: siteConfig.url,
      siteName: isArabic ? siteConfig.nameAr : siteConfig.name,
      images: [
        {
          url: image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: pageDescription,
      images: [image || siteConfig.ogImage],
      creator: "@fashionstore",
      site: "@fashionstore",
    },
    alternates: {
      canonical: siteConfig.url,
      languages: {
        ar: `${siteConfig.url}`,
        en: `${siteConfig.url}`,
      },
    },
    icons: {
      icon: siteConfig.favicon,
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: isArabic ? siteConfig.nameAr : siteConfig.name,
    },
  };
}

/**
 * Default metadata for the site
 */
export const defaultMetadata: Metadata = generateMetadata({});

/**
 * Helper function to get contact info by locale
 */
export function getContactInfo(locale: "ar" | "en" = "ar") {
  return {
    ...siteConfig.contact,
    address: siteConfig.contact.address[locale],
    addressFull: siteConfig.contact.addressFull[locale],
    workingHours: siteConfig.contact.workingHours[locale],
  };
}

/**
 * Helper function to get social media links as array
 */
export function getSocialLinks() {
  return Object.entries(siteConfig.social).map(([platform, url]) => ({
    platform,
    url,
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
  }));
}
