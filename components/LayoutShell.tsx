"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const HIDE_NAVBAR_ROUTES = new Set(["/register", "/login"]);

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = HIDE_NAVBAR_ROUTES.has(pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
