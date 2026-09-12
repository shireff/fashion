import type { Metadata } from "next";

export const siteConfig = {
  name: "Fashion",
  nameAr: "فاشون",
  description: "Modern fashion store offering trendy clothing and accessories",
  descriptionAr: "متجر أزياء عصري يقدم ملابس وإكسسوارات عصرية",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://koko.com",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/koko",
    instagram: "https://instagram.com/koko",
    facebook: "https://facebook.com/koko",
  },
};

export function generateMetadata({
  title,
  titleAr,
  description,
  descriptionAr,
  image,
  noIndex = false,
  locale = "ar",
}: {
  title?: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  noIndex?: boolean;
  locale?: "ar" | "en";
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

  return {
    title: fullTitle,
    description: pageDescription,
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
    },
    alternates: {
      canonical: siteConfig.url,
      languages: {
        ar: `${siteConfig.url}/ar`,
        en: `${siteConfig.url}/en`,
      },
    },
  };
}

export const defaultMetadata: Metadata = generateMetadata({});
