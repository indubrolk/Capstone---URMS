"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Landmark, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import GlobalSearch from "./GlobalSearch";

export default function Navbar() {
    const pathname = usePathname();
    const { user, profile, signOut } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Resources", href: "/resources" },
        { name: "Bookings", href: "/bookings" },
    ];

    if (profile?.role === "admin" || profile?.role === "maintenance") {
        navLinks.push({ name: "Maintenance", href: "/maintenance" });
    }

    return (
        <nav className="sticky top-0 z-50 w-full glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <img
                                src="/urms-logo.png"
                                alt="URMS Logo"
                                className="w-8 h-8 rounded-lg shadow-sm border border-slate-100 bg-white p-0.5 object-contain transition-transform group-hover:scale-105"
                            />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-accent tracking-tight">
                                UniLink
                            </span>
                        </Link>
                    </div>

                    <div className="flex-1 px-4 lg:px-8 flex justify-center items-center">
                        <GlobalSearch />
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-semibold transition-colors hover:text-brand-primary ${pathname === link.href ? "text-brand-primary underline underline-offset-4 decoration-2" : "text-slate-600"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {user ? (
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-brand-danger transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-bold rounded-full text-white bg-brand-primary hover:bg-brand-secondary transition-all shadow-md active:scale-95"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 hover:text-brand-primary focus:outline-none transition-colors"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-100 flex flex-col p-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`text-base font-semibold px-2 py-1 rounded-md ${pathname === link.href ? "text-brand-primary bg-brand-primary/5" : "text-slate-600"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-2 border-t border-slate-100">
                        {user ? (
                            <button
                                onClick={() => {
                                    signOut();
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-2 w-full text-left text-brand-danger font-bold text-base px-2 py-2"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center justify-center w-full px-5 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-brand-primary"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
