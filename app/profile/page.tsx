"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import {
    User as UserIcon,
    Mail,
    Shield,
    Save,
    Edit2,
    Loader2,
    X,
    CheckCircle2,
    AlertCircle,
    KeyRound,
    Calendar,
    BadgeCheck,
    Sparkles,
    Lock,
    Building2,
    ChevronRight,
} from "lucide-react";

/* ─── Role config ──────────────────────────────────────────── */
const roleMeta: Record<string, {
    label: string;
    gradient: string;
    badge: string;
    badgeText: string;
    dot: string;
    icon: string;
}> = {
    admin:       { label: "Administrator", gradient: "from-violet-500 to-purple-600",  badge: "bg-violet-50 border-violet-200",  badgeText: "text-violet-700",  dot: "bg-violet-500", icon: "👑" },
    lecturer:    { label: "Lecturer",      gradient: "from-emerald-500 to-teal-600",   badge: "bg-emerald-50 border-emerald-200",badgeText: "text-emerald-700", dot: "bg-emerald-500",icon: "🎓" },
    student:     { label: "Student",       gradient: "from-blue-500 to-indigo-600",    badge: "bg-blue-50 border-blue-200",      badgeText: "text-blue-700",    dot: "bg-blue-500",   icon: "📚" },
    maintenance: { label: "Maintenance",   gradient: "from-amber-500 to-orange-600",   badge: "bg-amber-50 border-amber-200",    badgeText: "text-amber-700",   dot: "bg-amber-500",  icon: "🔧" },
};

function Orb({ className }: { className: string }) {
    return <div className={`absolute rounded-full blur-3xl pointer-events-none ${className}`} />;
}

/* ── static info card ──────────────────────────────────────── */
function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="group relative overflow-hidden bg-foreground/[0.03] border border-slate-200 dark:border-border hover:border-brand-primary/50 rounded-2xl p-5 transition-all duration-200 hover:bg-foreground/[0.05]">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 text-brand-primary">
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40 mb-1">{label}</p>
                    <p className="text-sm font-bold text-foreground truncate">{value}</p>
                </div>
            </div>
        </div>
    );
}
const defaultMeta = { label: "User", gradient: "from-slate-500 to-slate-700", badge: "bg-slate-50 border-slate-200", badgeText: "text-slate-700", dot: "bg-slate-500", icon: "👤" };

export default function ProfilePage() {
    const { user, profile, loading: authLoading } = useAuth();

    const [isEditing,   setIsEditing]   = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);
    const [error,       setError]       = useState<string | null>(null);
    const [success,     setSuccess]     = useState<string | null>(null);
    const [localName,   setLocalName]   = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            try {
                const token = (user && typeof user.getIdToken === 'function') ? await user.getIdToken() : "dev-token";
                const res = await fetch("http://localhost:5000/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();
                setProfile(data);
                setDisplayName(data.displayName || "");
            } catch (err: any) {
                console.error(err);
                setError("Could not load profile data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);
        if (profile?.name)          setDisplayName(profile.name);
        else if (user?.displayName) setDisplayName(user.displayName);
        else if (user?.email)       setDisplayName(user.email.split("@")[0]);
    }, [profile, user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setError(null); setSuccess(null); setSaveLoading(true);
        try {
            const token = (user && typeof user.getIdToken === 'function') ? await user.getIdToken() : "dev-token";
            const res = await fetch("http://localhost:5000/api/users/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ displayName: displayName.trim() }),
            });
            if (!res.ok) throw new Error();
            setLocalName(displayName.trim());
            setSuccess("Profile updated successfully!");
            setIsEditing(false);
        } catch {
            setLocalName(displayName.trim());
            setSuccess("Name updated!");
            setIsEditing(false);
        } finally {
            setSaveLoading(false);
        }
    };

    /* ── Derived ── */
    const currentName  = localName ?? profile?.name ?? user?.displayName ?? (user?.email ? user.email.split("@")[0] : "User");
    const currentEmail = profile?.email ?? user?.email ?? "—";
    const currentRole  = profile?.role  ?? "student";
    const meta         = roleMeta[currentRole] ?? defaultMeta;

    const initials = currentName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

    const joinDate = user?.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "—";

    const infoItems = [
        { icon: <Mail className="w-4 h-4" />,     label: "Email Address", value: currentEmail,   color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-100"   },
        { icon: <Shield className="w-4 h-4" />,   label: "Role",          value: meta.label,     color: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-100" },
        { icon: <Calendar className="w-4 h-4" />, label: "Member Since",  value: joinDate,        color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100"},
        { icon: <Building2 className="w-4 h-4" />,label: "Institution",   value: "SUSL",          color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-100"  },
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-[calc(100vh-64px)] bg-background relative overflow-hidden">
                {/* background orbs */}
                <Orb className="w-96 h-96 bg-brand-primary/10 -top-20 -right-20 animate-pulse" />
                <Orb className="w-72 h-72 bg-indigo-500/5 bottom-10 -left-20 animate-pulse" />

                {/* subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: "linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    {/* ── PAGE HEADING ── */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-3 py-1 mb-4">
                            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                            <span className="text-brand-primary text-[10px] font-black uppercase tracking-widest">Account Settings</span>
                        </div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight">My Profile</h1>
                        <p className="text-slate-600 dark:text-foreground/50 font-medium mt-1">Manage your personal information and account settings.</p>
                    </div>

                    {/* ── LOADING ── */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                            </div>
                            <p className="text-slate-500 dark:text-foreground/40 font-black text-[10px] uppercase tracking-widest">Loading your profile…</p>
            <div className="min-h-screen bg-slate-50 overflow-x-hidden">

                <style>{`
                    @keyframes slide-up   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
                    @keyframes fade-in    { from{opacity:0} to{opacity:1} }
                    @keyframes shimmer    { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                    @keyframes pulse-dot  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.3);opacity:0.7} }
                    .anim-up-1  { animation: slide-up 0.5s ease 0.05s both; }
                    .anim-up-2  { animation: slide-up 0.5s ease 0.15s both; }
                    .anim-up-3  { animation: slide-up 0.5s ease 0.25s both; }
                    .anim-up-4  { animation: slide-up 0.5s ease 0.35s both; }
                    .anim-fade  { animation: fade-in  0.6s ease 0.1s  both; }
                    .card-hover { transition: all 0.25s cubic-bezier(.4,0,.2,1); }
                    .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
                    .online-dot { animation: pulse-dot 2s ease-in-out infinite; }
                `}</style>

                {authLoading ? (
                    /* ── LOADING ── */
                    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                        <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-md">
                            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                        </div>
                        <p className="text-slate-400 font-semibold text-sm">Loading your profile…</p>
                    </div>

                ) : !user ? (
                    /* ── NOT SIGNED IN ── */
                    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                        <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center shadow-md">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <p className="text-slate-700 font-bold">Not signed in</p>
                        <p className="text-slate-400 text-sm">Please sign in to view your profile.</p>
                    </div>

                ) : (
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

                            {/* ── PROFILE HERO CARD ── */}
                            <div className="relative overflow-hidden bg-card border border-slate-200 dark:border-border rounded-3xl">
                                {/* decorative top strip */}
                                <div className="h-28 bg-gradient-to-r from-brand-primary/20 via-indigo-500/10 to-brand-primary/5 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20 text-foreground" />
                                    <Orb className="w-40 h-40 bg-brand-primary/20 -top-10 right-10 animate-none" />
                                </div>

                                {/* avatar + name row */}
                                <div className="px-8 pb-8">
                                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 mb-6">
                                        <div className="flex items-end gap-5">
                                            {/* avatar */}
                                            <div className="relative shrink-0">
                                                <div className="w-20 h-20 rounded-2xl bg-brand-primary flex items-center justify-center text-white text-2xl font-black shadow-2xl shadow-brand-primary/40 border-4 border-card">
                                                    {initials}
                                                </div>
                                                {/* online dot */}
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-card shadow-lg shadow-emerald-500/50" />
                                            </div>
                        {/* ══════════════════════════════════════════════
                            HERO BANNER CARD
                        ══════════════════════════════════════════════ */}
                        <div className="anim-up-1 relative overflow-hidden rounded-3xl shadow-xl shadow-slate-200/80">

                            {/* Gradient banner top */}
                            <div className={`h-36 bg-gradient-to-br ${meta.gradient} relative overflow-hidden`}>
                                {/* decorative circles */}
                                <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full" />
                                <div className="absolute -bottom-12 -left-8 w-56 h-56 bg-white/10 rounded-full" />
                                <div className="absolute top-4 right-24 w-20 h-20 bg-white/5 rounded-full" />
                                {/* dot grid overlay */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                            </div>

                            {/* White body */}
                            <div className="bg-white px-8 pb-8">
                                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 mb-7">

                                    {/* Avatar + Name */}
                                    <div className="flex items-end gap-5">
                                        {/* Avatar ring */}
                                        <div className={`relative p-1 rounded-3xl bg-gradient-to-br ${meta.gradient} shadow-2xl`}>
                                            <div className="w-24 h-24 rounded-[20px] bg-white flex items-center justify-center text-3xl font-black text-slate-800">
                                                {initials}
                                            </div>
                                            {/* Online indicator */}
                                            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-400 border-2 border-white shadow online-dot" />
                                        </div>

                                        {!isEditing && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-foreground/5 hover:bg-slate-200 dark:bg-foreground/10 border border-slate-200 dark:border-border hover:border-brand-primary/50 text-foreground text-sm font-black rounded-xl transition-all duration-200 active:scale-95"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit Profile
                                            </button>
                                        )}
                                        <div className="pb-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h1 className="text-2xl font-black text-slate-900 leading-tight">{currentName}</h1>
                                                <span className="text-lg">{meta.icon}</span>
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium">{currentEmail}</p>
                                            <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold border ${meta.badge} ${meta.badgeText}`}>
                                                <BadgeCheck className="w-3.5 h-3.5" />
                                                {meta.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Edit button */}
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${meta.gradient} shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-95 transition-all duration-200`}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit Profile
                                        </button>
                                    )}
                                </div>

                                {/* Info grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    {infoItems.map((item, i) => (
                                        <div
                                            key={i}
                                            className={`card-hover flex items-center gap-3 p-4 rounded-2xl border ${item.border} ${item.bg}`}
                                        >
                                            <div className={`shrink-0 w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm ${item.color}`}>
                                                {item.icon}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
                                                <p className="text-sm font-bold text-slate-800 truncate mt-0.5">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                            {/* ── EDIT FORM ── */}
                            {isEditing && (
                                <div className="bg-card/80 border border-slate-200 dark:border-border rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 rounded-xl bg-brand-primary/15 border border-brand-primary/25 flex items-center justify-center">
                                            <Edit2 className="w-4 h-4 text-brand-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-foreground">Edit Information</h3>
                                            <p className="text-[10px] font-black text-slate-500 dark:text-foreground/40 uppercase tracking-widest">Update your display name below</p>
                        {/* ══════════════════════════════════════════════
                            EDIT FORM (slides in)
                        ══════════════════════════════════════════════ */}
                        {isEditing && (
                            <div className="anim-up-2 bg-white border border-slate-100 rounded-3xl shadow-lg shadow-slate-200/60 overflow-hidden">
                                {/* Top accent */}
                                <div className={`h-1 bg-gradient-to-r ${meta.gradient}`} />

                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-7">
                                        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-md`}>
                                            <Edit2 className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-black text-slate-900">Edit Information</h2>
                                            <p className="text-sm text-slate-400">Update your display name</p>
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-2xl mb-6">
                                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                            <p className="text-sm font-semibold text-red-600">{error}</p>
                                        </div>
                                    )}

                                    <form onSubmit={handleSave} className="space-y-5 max-w-lg">
                                        {/* Full name */}
                                        <div>
                                            <label htmlFor="displayName" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40 mb-2">
                                            <label htmlFor="displayName" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <UserIcon className="h-4 w-4 text-slate-400 dark:text-foreground/30" />
                                                    <UserIcon className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <input
                                                    id="displayName"
                                                    type="text"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    disabled={saveLoading}
                                                    required
                                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-foreground/5 border border-slate-200 dark:border-border rounded-2xl text-sm font-bold text-foreground placeholder-slate-400 dark:placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary/60 transition-all disabled:opacity-40"
                                                    placeholder="Your full name"
                                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all disabled:opacity-50"
                                                />
                                            </div>
                                        </div>

                                        {/* email (read-only) */}
                                        <div className="opacity-50">
                                            <label htmlFor="email-ro" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40 mb-2">
                                                Email Address <span className="normal-case font-bold">(read-only)</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Mail className="h-4 w-4 text-slate-400 dark:text-foreground/30" />
                                        {/* Email (read-only) */}
                                        <div className="opacity-60 pointer-events-none">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                                Email Address <span className="normal-case font-medium">(read-only)</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Mail className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={currentEmail}
                                                    disabled
                                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-foreground/5 border border-slate-200 dark:border-border rounded-2xl text-sm font-bold text-slate-600 dark:text-foreground/60 cursor-not-allowed"
                                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-500 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        {/* role (read-only) */}
                                        <div className="opacity-50">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40 mb-2">
                                                Role <span className="normal-case font-bold">(read-only)</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <KeyRound className="h-4 w-4 text-slate-400 dark:text-foreground/30" />
                                        {/* Role (read-only) */}
                                        <div className="opacity-60 pointer-events-none">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                                Role <span className="normal-case font-medium">(read-only)</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <KeyRound className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={meta.label}
                                                    disabled
                                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-foreground/5 border border-slate-200 dark:border-border rounded-2xl text-sm font-bold text-slate-600 dark:text-foreground/60 cursor-not-allowed capitalize"
                                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-500 cursor-not-allowed capitalize"
                                                />
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="submit"
                                                disabled={saveLoading}
                                                className={`relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${meta.gradient} shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                {saveLoading ? "Saving…" : "Save Changes"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setIsEditing(false); setDisplayName(currentName); setError(null); }}
                                                disabled={saveLoading}
                                                className="inline-flex items-center gap-2 border border-slate-200 dark:border-border bg-slate-100 dark:bg-foreground/5 hover:bg-slate-200 dark:bg-foreground/10 text-slate-600 dark:text-foreground/60 font-black text-sm uppercase tracking-widest px-6 py-3 rounded-xl transition-all disabled:opacity-50"
                                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* ── Success toast ── */}
                        {success && (
                            <div className="anim-fade flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                <p className="text-sm font-bold text-emerald-700">{success}</p>
                            </div>
                        )}

                        {/* ══════════════════════════════════════════════
                            BOTTOM ROW: Security + Quick Links
                        ══════════════════════════════════════════════ */}
                        <div className="anim-up-3 grid md:grid-cols-2 gap-6">

                            {/* Security Card */}
                            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm shadow-slate-200/60 overflow-hidden">
                                <div className="px-6 pt-6 pb-2 flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md">
                                        <Lock className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-slate-900">Security Status</h3>
                                        <p className="text-xs text-slate-400">Account protection overview</p>
                                    </div>
                                </div>
                            )}

                            {/* ── ACCOUNT SECURITY CARD ── */}
                            <div className="bg-card/80 border border-slate-200 dark:border-border rounded-3xl p-6">
                                <h3 className="text-[10px] font-black text-slate-500 dark:text-foreground/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-brand-primary" />
                                    Account Security
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex items-start gap-3 p-4 bg-foreground/[0.02] border border-slate-200 dark:border-border rounded-2xl">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-sm shadow-emerald-500/60" />
                                        <div>
                                            <p className="text-sm font-black text-foreground">Email Verified</p>
                                            <p className="text-[10px] font-bold text-slate-500 dark:text-foreground/40 mt-0.5 uppercase tracking-wider">
                                                {user?.emailVerified ? "Your email is verified" : "Email not yet verified"}
                                            </p>

                                <div className="px-6 pb-6 space-y-3">
                                    {/* Email verified */}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2.5 h-2.5 rounded-full ${user?.emailVerified ? "bg-emerald-400" : "bg-amber-400"}`} />
                                            <span className="text-sm font-semibold text-slate-700">Email Verified</span>
                                        </div>
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user?.emailVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                            {user?.emailVerified ? "Verified" : "Pending"}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-foreground/[0.02] border border-slate-200 dark:border-border rounded-2xl">
                                        <div className="w-2 h-2 rounded-full bg-brand-primary mt-1.5 shrink-0 shadow-sm shadow-brand-primary/60" />
                                        <div>
                                            <p className="text-sm font-black text-foreground">Institutional Account</p>
                                            <p className="text-[10px] font-bold text-slate-500 dark:text-foreground/40 mt-0.5 uppercase tracking-wider">Managed by university system</p>

                                    {/* Account type */}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                                            <span className="text-sm font-semibold text-slate-700">Account Type</span>
                                        </div>
                                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                                            Institutional
                                        </span>
                                    </div>

                                    {/* Role badge */}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} />
                                            <span className="text-sm font-semibold text-slate-700">Access Level</span>
                                        </div>
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${meta.badge} ${meta.badgeText}`}>
                                            {meta.label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                    ) : (
                        /* ── ERROR STATE ── */
                        <div className="flex flex-col items-center justify-center py-32 gap-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl">
                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-slate-800 dark:text-white font-bold">Failed to load profile</p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Please refresh the page or try again later.</p>
                            {/* Quick Links Card */}
                            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm shadow-slate-200/60 overflow-hidden">
                                <div className="px-6 pt-6 pb-2 flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-md`}>
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-slate-900">Quick Access</h3>
                                        <p className="text-xs text-slate-400">Navigate to your key pages</p>
                                    </div>
                                </div>

                                <div className="px-6 pb-6 space-y-2">
                                    {[
                                        { label: "My Bookings",       href: "/bookings",    desc: "View & manage reservations" },
                                        { label: "Browse Resources",  href: "/resources",   desc: "Labs, equipment & rooms"    },
                                        { label: "Dashboard",         href: "/dashboard",   desc: "Overview & analytics"       },
                                    ].map((link) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            className="card-hover flex items-center justify-between p-4 bg-slate-50 border border-slate-100 hover:border-brand-primary/30 hover:bg-blue-50 rounded-2xl group"
                                        >
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 group-hover:text-brand-primary transition-colors">{link.label}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{link.desc}</p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Footer note ── */}
                        <div className="anim-up-4 text-center py-4">
                            <p className="text-xs text-slate-400">UniLink · University Resource Management System · SUSL © {new Date().getFullYear()}</p>
                        </div>

                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
