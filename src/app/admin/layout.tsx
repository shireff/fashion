import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "فاشون Admin",
  },
};

export const viewport: Viewport = {
  themeColor: "#9333ea",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
