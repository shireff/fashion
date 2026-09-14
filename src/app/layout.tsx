import type { Metadata } from "next";
import { Cairo, Geist_Mono, Geist } from "next/font/google";
import "./globals.css";
import "./error-handler";
import "./web-vitals-polyfill";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ErrorBoundaryWithTranslations } from "@/components/ErrorBoundary";
import { defaultMetadata } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn("h-full", "antialiased", cairo.variable, geistMono.variable, "font-sans", geist.variable)}
    >
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#9333ea" />
        {/* No manifest for regular users - PWA only for admin */}
      </head>
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <NextIntlClientProvider messages={messages}>
            <ErrorBoundaryWithTranslations>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster position="top-center" richColors closeButton />
            </ErrorBoundaryWithTranslations>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
