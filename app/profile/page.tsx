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
} from "lucide-react";

interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: string;
}

/* ── role meta ─────────────────────────────────────────────── */
const roleMeta: Record<string, { color: string; bg: string; label: string }> = {
    admin:       { color: "text-purple-300",  bg: "bg-purple-500/15 border-purple-500/30",  label: "Administrator"  },
    lecturer:    { color: "text-emerald-300", bg: "bg-emerald-500/15 border-emerald-500/30", label: "Lecturer"      },
    student:     { color: "text-blue-300",    bg: "bg-blue-500/15 border-blue-500/30",       label: "Student"       },
    maintenance: { color: "text-amber-300",   bg: "bg-amber-500/15 border-amber-500/30",     label: "Maintenance"   },
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

export default function ProfilePage() {
    const { user } = useAuth();

    const [profile,     setProfile]     = useState<UserProfile | null>(null);
    const [loading,     setLoading]     = useState(true);
    const [isEditing,   setIsEditing]   = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);
    const [error,       setError]       = useState<string | null>(null);
    const [success,     setSuccess]     = useState<string | null>(null);

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setError(null);
        setSuccess(null);
        setSaveLoading(true);
        try {
            const token = (user && typeof user.getIdToken === 'function') ? await user.getIdToken() : "dev-token";
            const res = await fetch("http://localhost:5000/api/users/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ displayName: displayName.trim() }),
            });
            if (!res.ok) throw new Error("Failed to update profile");
            const data = await res.json();
            setProfile(data.user);
            setSuccess("Profile updated successfully!");
            setIsEditing(false);
        } catch (err: any) {
            console.error(err);
            setError("Could not update profile. Please try again.");
        } finally {
            setSaveLoading(false);
        }
    };

    /* derived */
    const initials = profile?.displayName
        ? profile.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";
    const meta = profile?.role ? roleMeta[profile.role] : null;
    const joinDate = user?.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "—";

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
                        </div>

                    ) : profile ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

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

                                            <div className="pb-1">
                                                <h2 className="text-xl font-black text-white leading-tight">
                                                    {profile.displayName || "Unknown User"}
                                                </h2>
                                                {meta && (
                                                    <span className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${meta.bg} ${meta.color}`}>
                                                        <BadgeCheck className="w-3.5 h-3.5" />
                                                        {meta.label}
                                                    </span>
                                                )}
                                            </div>
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
                                    </div>

                                    {/* info grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        <InfoCard icon={<Mail className="w-5 h-5" />}     label="Email Address" value={profile.email} />
                                        <InfoCard icon={<Shield className="w-5 h-5" />}   label="Role"          value={profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : "—"} />
                                        <InfoCard icon={<Calendar className="w-5 h-5" />} label="Member Since"  value={joinDate} />
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
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl mb-5 animate-in fade-in duration-200">
                                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                            <p className="text-sm font-semibold text-red-400">{error}</p>
                                        </div>
                                    )}

                                    <form onSubmit={handleSave} className="space-y-5 max-w-md">
                                        {/* display name */}
                                        <div>
                                            <label htmlFor="displayName" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40 mb-2">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <UserIcon className="h-4 w-4 text-slate-400 dark:text-foreground/30" />
                                                </div>
                                                <input
                                                    id="displayName"
                                                    type="text"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    disabled={saveLoading}
                                                    required
                                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-foreground/5 border border-slate-200 dark:border-border rounded-2xl text-sm font-bold text-foreground placeholder-slate-400 dark:placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary/60 transition-all disabled:opacity-40"
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
                                                </div>
                                                <input
                                                    id="email-ro"
                                                    type="email"
                                                    value={profile.email}
                                                    disabled
                                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-foreground/5 border border-slate-200 dark:border-border rounded-2xl text-sm font-bold text-slate-600 dark:text-foreground/60 cursor-not-allowed"
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
                                                </div>
                                                <input
                                                    type="text"
                                                    value={profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : ""}
                                                    disabled
                                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-100 dark:bg-foreground/5 border border-slate-200 dark:border-border rounded-2xl text-sm font-bold text-slate-600 dark:text-foreground/60 cursor-not-allowed capitalize"
                                                />
                                            </div>
                                        </div>

                                        {/* actions */}
                                        <div className="flex items-center gap-3 pt-2">
                                            <button
                                                type="submit"
                                                disabled={saveLoading}
                                                className="relative overflow-hidden inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                                                {saveLoading
                                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                                    : <Save className="w-4 h-4" />
                                                }
                                                {saveLoading ? "Saving…" : "Save Changes"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setDisplayName(profile.displayName);
                                                    setError(null);
                                                }}
                                                disabled={saveLoading}
                                                className="inline-flex items-center gap-2 border border-slate-200 dark:border-border bg-slate-100 dark:bg-foreground/5 hover:bg-slate-200 dark:bg-foreground/10 text-slate-600 dark:text-foreground/60 font-black text-sm uppercase tracking-widest px-6 py-3 rounded-xl transition-all disabled:opacity-50"
                                            >
                                                <X className="w-4 h-4" />
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* ── SUCCESS TOAST ── */}
                            {success && (
                                <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                    <p className="text-sm font-semibold text-emerald-400">{success}</p>
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
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-foreground/[0.02] border border-slate-200 dark:border-border rounded-2xl">
                                        <div className="w-2 h-2 rounded-full bg-brand-primary mt-1.5 shrink-0 shadow-sm shadow-brand-primary/60" />
                                        <div>
                                            <p className="text-sm font-black text-foreground">Institutional Account</p>
                                            <p className="text-[10px] font-bold text-slate-500 dark:text-foreground/40 mt-0.5 uppercase tracking-wider">Managed by university system</p>
                                        </div>
                                    </div>
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
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
