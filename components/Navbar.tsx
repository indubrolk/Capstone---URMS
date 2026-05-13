"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X, ChevronDown, User, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import GlobalSearch from "./GlobalSearch";

/* ── role colours ─────────────────────────────────────────── */
const roleMeta: Record<string, { label: string; dot: string; badge: string; text: string }> = {
    admin:       { label: "Administrator", dot: "bg-purple-500", badge: "bg-purple-50 border-purple-200",  text: "text-purple-700"  },
    lecturer:    { label: "Lecturer",      dot: "bg-emerald-500",badge: "bg-emerald-50 border-emerald-200",text: "text-emerald-700" },
    student:     { label: "Student",       dot: "bg-blue-500",   badge: "bg-blue-50 border-blue-200",      text: "text-blue-700"    },
    maintenance: { label: "Maintenance",   dot: "bg-amber-500",  badge: "bg-amber-50 border-amber-200",    text: "text-amber-700"   },
};

export default function Navbar() {
    const pathname    = usePathname();
    const { user, profile, signOut } = useAuth();
    const [isOpen,   setIsOpen]   = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    const [hovered,  setHovered]  = useState<string | null>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLSpanElement>(null);
    const navRef       = useRef<HTMLDivElement>(null);

    /* scroll shadow */
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 4);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    /* outside click → close user menu */
    useEffect(() => {
        const fn = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
                setUserMenu(false);
        };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, []);

    /* close mobile on route change */
    useEffect(() => { setIsOpen(false); }, [pathname]);

    /* ── role-based nav links (unchanged) ── */
    let navLinks: { name: string; href: string }[] = [];
    switch (profile?.role) {
        case "admin":
            navLinks = [
                { name: "Admin Console",      href: "/dashboard"   },
                { name: "Manage Resources",   href: "/resources"   },
                { name: "All Bookings",       href: "/bookings"    },
                { name: "System Maintenance", href: "/maintenance" },
            ]; break;
        case "lecturer":
            navLinks = [
                { name: "Teacher Portal",    href: "/dashboard" },
                { name: "Faculty Resources", href: "/resources"  },
                { name: "My Bookings",       href: "/bookings"  },
            ]; break;
        case "student":
            navLinks = [
                { name: "Student Hub",      href: "/dashboard" },
                { name: "Browse Resources", href: "/resources"  },
                { name: "My Bookings",      href: "/bookings"  },
            ]; break;
        case "maintenance":
            navLinks = [
                { name: "Operations Hub", href: "/dashboard"   },
                { name: "Active Tickets", href: "/maintenance" },
            ]; break;
        default:
            navLinks = [
                { name: "Home",      href: "/"          },
                { name: "Resources", href: "/resources" },
            ];
    }

    const meta     = profile?.role ? roleMeta[profile.role] : null;
    const initials = profile?.name
        ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : user?.email?.[0].toUpperCase() ?? "U";

    /* sliding indicator: move to hovered or active link */
    useEffect(() => {
        const key   = hovered ?? pathname;
        const el    = navRef.current?.querySelector<HTMLElement>(`[data-href="${key}"]`);
        const bar   = indicatorRef.current;
        if (!el || !bar || !navRef.current) return;
        const navRect = navRef.current.getBoundingClientRect();
        const rect    = el.getBoundingClientRect();
        bar.style.left  = `${rect.left - navRect.left}px`;
        bar.style.width = `${rect.width}px`;
        bar.style.opacity = "1";
    }, [hovered, pathname, navLinks]);

    return (
        <>
            {/* ════════════════════ NAVBAR ════════════════════ */}
            <nav className={`sticky top-0 z-50 w-full bg-white transition-all duration-300 ${
                scrolled ? "shadow-[0_2px_24px_rgba(0,0,0,0.08)] border-b border-slate-100" : "border-b border-slate-100/60"
            }`}>

                {/* animated top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-primary via-blue-400 to-brand-primary bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]" />

                <style>{`
                    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                    @keyframes fadeUp  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
                    .nav-item-enter { animation: fadeUp 0.25s ease forwards; }
                `}</style>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16 gap-4">

                        {/* ── LOGO ── */}
                        <Link href="/" className="flex items-center gap-2.5 group shrink-0 mr-2">
                            <div className="relative">
                                {/* glow ring on hover */}
                                <span className="absolute inset-0 rounded-xl scale-0 group-hover:scale-110 bg-brand-primary/10 transition-transform duration-300 ease-out" />
                                <img
                                    src="/urms-logo.png"
                                    alt="URMS Logo"
                                    className="relative w-8 h-8 rounded-xl object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                                />
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-brand-primary transition-colors duration-200">
                                Uni<span className="text-brand-primary group-hover:text-slate-900 transition-colors duration-200">Link</span>
                            </span>
                        </Link>

                        {/* ── SEARCH ── */}
                        <div className="flex-1 flex justify-center px-2 lg:px-6">
                            <GlobalSearch />
                        </div>

                        {/* ── DESKTOP LINKS ── */}
                        <div
                            ref={navRef}
                            className="hidden md:flex items-center gap-1 relative"
                            onMouseLeave={() => setHovered(null)}
                        >
                            {/* sliding pill indicator */}
                            <span
                                ref={indicatorRef}
                                className="absolute bottom-0 h-0.5 bg-brand-primary rounded-full transition-all duration-300 ease-out opacity-0 pointer-events-none"
                                style={{ left: 0, width: 0 }}
                            />

                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        data-href={link.href}
                                        onMouseEnter={() => setHovered(link.href)}
                                        className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                                            isActive
                                                ? "text-brand-primary"
                                                : "text-slate-500 hover:text-slate-900"
                                        }`}
                                    >
                                        {/* active dot */}
                                        {isActive && (
                                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary/60" />
                                        )}
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* ── USER / AUTH AREA ── */}
                        <div className="hidden md:flex items-center gap-2 shrink-0">
                            {user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenu(!userMenu)}
                                        className={`flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-2xl border transition-all duration-200 ${
                                            userMenu
                                                ? "border-brand-primary/30 bg-brand-primary/5 shadow-sm"
                                                : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                                        }`}
                                    >
                                        {/* avatar */}
                                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center text-white text-xs font-black shadow">
                                            {initials}
                                        </div>
                                        <div className="text-left leading-none">
                                            <p className="text-xs font-bold text-slate-900">
                                                {profile?.name?.split(" ")[0] ?? "User"}
                                            </p>
                                            {meta && (
                                                <p className={`text-[10px] font-semibold mt-0.5 ${meta.text}`}>{meta.label}</p>
                                            )}
                                        </div>
                                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userMenu ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* ── DROPDOWN ── */}
                                    {userMenu && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                            {/* header */}
                                            <div className="px-4 py-3.5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center text-white text-sm font-black shadow-md shrink-0">
                                                        {initials}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 truncate">{profile?.name ?? "User"}</p>
                                                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                                {meta && (
                                                    <span className={`inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-[10px] font-black border ${meta.badge} ${meta.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                                        {meta.label}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="p-2">
                                                <Link
                                                    href="/profile"
                                                    onClick={() => setUserMenu(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all group"
                                                >
                                                    <span className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-brand-primary/10 flex items-center justify-center transition-colors">
                                                        <User className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-primary transition-colors" />
                                                    </span>
                                                    My Profile
                                                </Link>
                                                <button
                                                    onClick={() => { signOut(); setUserMenu(false); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 transition-all group"
                                                >
                                                    <span className="w-7 h-7 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                                                        <LogOut className="w-3.5 h-3.5 text-red-400" />
                                                    </span>
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href="/register"
                                        className="text-sm font-semibold text-slate-500 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all"
                                    >
                                        Register
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="relative overflow-hidden inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-brand-primary to-blue-600 hover:from-blue-600 hover:to-brand-primary shadow-md shadow-brand-primary/25 hover:shadow-brand-primary/40 transition-all duration-300 active:scale-95 group"
                                    >
                                        {/* shimmer */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                                        <Sparkles className="w-3.5 h-3.5 relative" />
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* ── HAMBURGER ── */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all"
                            aria-label="Toggle menu"
                        >
                            <span className={`block h-0.5 bg-slate-700 rounded-full transition-all duration-300 origin-center ${isOpen ? "w-5 rotate-45 translate-y-[7px]" : "w-5"}`} />
                            <span className={`block h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${isOpen ? "w-0 opacity-0" : "w-4"}`} />
                            <span className={`block h-0.5 bg-slate-700 rounded-full transition-all duration-300 origin-center ${isOpen ? "w-5 -rotate-45 -translate-y-[7px]" : "w-5"}`} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ════════════════════ MOBILE DRAWER ════════════════════ */}
            <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}>
                {/* backdrop */}
                <div
                    className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setIsOpen(false)}
                />

                {/* panel */}
                <div className={`absolute top-16 left-3 right-3 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/80 overflow-hidden transition-all duration-300 ${
                    isOpen ? "translate-y-0 opacity-100 scale-100" : "-translate-y-3 opacity-0 scale-95"
                }`}>

                    {/* user strip */}
                    {user && (
                        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center text-white font-black shadow-md shrink-0">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{profile?.name ?? "User"}</p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                            </div>
                            {meta && (
                                <span className={`ml-auto shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border ${meta.badge} ${meta.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                    {meta.label}
                                </span>
                            )}
                        </div>
                    )}

                    {/* nav links */}
                    <div className="p-3 space-y-0.5">
                        {navLinks.map((link, i) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`nav-item-enter flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                        isActive
                                            ? "bg-brand-primary/8 text-brand-primary"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                    }`}
                                    style={{ animationDelay: `${i * 40}ms` }}
                                >
                                    {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                                    )}
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* auth actions */}
                    <div className="px-3 pb-3 border-t border-slate-100 pt-3 space-y-1.5">
                        {user ? (
                            <>
                                <Link
                                    href="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                                >
                                    <User className="w-4 h-4 text-slate-400" />
                                    My Profile
                                </Link>
                                <button
                                    onClick={() => { signOut(); setIsOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-primary to-blue-600 shadow-md shadow-brand-primary/25 active:scale-95 transition-all"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all"
                                >
                                    Create Account
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
