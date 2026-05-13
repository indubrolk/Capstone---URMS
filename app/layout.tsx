import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: "UniLink | Campus Resource Hub",
  description: "Centralized Resource Management System for University Faculties",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full flex flex-col scroll-smooth selection:bg-brand-primary/20">
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
