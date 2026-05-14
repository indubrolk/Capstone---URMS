"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AtSign, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles, Shield, Zap, Users, Home, ChevronLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

/* ─── tiny animated orb helper ─── */
function Orb({ className }: { className: string }) {
    return <div className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`} />;
}

/* ─── floating stat card ─── */
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 bg-slate-200/50 dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-2xl px-4 py-3">
            <div className="text-blue-500 dark:text-blue-300">{icon}</div>
            <div>
                <p className="text-slate-800 dark:text-white font-bold text-sm leading-none">{value}</p>
                <p className="text-slate-600 dark:text-white/60 text-xs mt-0.5">{label}</p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    const { signIn, setMockUser } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await signIn(email, password);
            router.push("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                if (err.message.includes("wrong-password") || err.message.includes("invalid-credential")) {
                    setError("Incorrect email or password.");
                } else if (err.message.includes("user-not-found")) {
                    setError("No account found with that email.");
                } else if (err.message.includes("too-many-requests")) {
                    setError("Too many failed attempts. Try again later.");
                } else {
                    setError("Sign-in failed. Please try again.");
                }
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">

            {/* ══════════════ LEFT PANEL ══════════════ */}
            <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-10 overflow-hidden">
                {/* animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-cyan-950/20 to-background" />
                <Orb className="w-96 h-96 bg-cyan-600 -top-24 -left-24" />
                <Orb className="w-72 h-72 bg-blue-500 bottom-32 right-0" />
                <Orb className="w-48 h-48 bg-sky-400 top-1/2 left-1/3" />

                {/* grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                        backgroundSize: "40px 40px"
                    }}
                />

                {/* campus photo overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop"
                        alt="University Campus"
                        className="w-full h-full object-cover opacity-10 mix-blend-luminosity"
                    />
                </div>

                {/* content */}
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-card backdrop-blur border border-slate-200 dark:border-border rounded-full px-4 py-2 mb-8">
                        <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-300" />
                        <span className="text-slate-700 dark:text-foreground/80 text-xs font-semibold tracking-wide">University Resource Management</span>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col gap-8">
                    <div>
                        <h2 className="text-5xl font-black text-foreground leading-[1.1] tracking-tight mb-5">
                            Streamline<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400 dark:from-blue-300 dark:to-sky-200">
                                Campus Resources.
                            </span>
                        </h2>
                        <p className="text-slate-600 dark:text-foreground/60 text-lg font-medium leading-relaxed max-w-sm">
                            Access the centralized hub for university resource management and laboratory analytics.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <StatCard icon={<Shield className="w-4 h-4" />} label="Uptime" value="99.9%" />
                        <StatCard icon={<Users className="w-4 h-4" />} label="Active Users" value="15K+" />
                        <StatCard icon={<Zap className="w-4 h-4" />} label="Resources" value="1,200+" />
                        <StatCard icon={<Sparkles className="w-4 h-4" />} label="Departments" value="50+" />
                    </div>
                </div>
            </div>

            {/* ══════════════ RIGHT PANEL ══════════════ */}
            <div className="flex w-full lg:w-[48%] flex-col p-6 sm:p-8 relative overflow-y-auto">
                {/* Back to Home Link */}
                <div className="flex justify-start mb-6">
                    <Link 
                        href="/" 
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-foreground/5 hover:bg-slate-200 dark:bg-foreground/10 border border-slate-200 dark:border-border text-slate-700 dark:text-foreground/70 hover:text-foreground text-[10px] font-black uppercase tracking-widest transition-all group z-20"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/[0.05] dark:from-cyan-950/20 to-background -z-10" />
                    <Orb className="w-64 h-64 bg-cyan-700 top-0 right-0 opacity-10" />

                    <div className="relative z-10 w-full max-w-sm">


                    {/* heading */}
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-3 py-1 mb-5">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                            <span className="text-cyan-600 dark:text-cyan-300 text-xs font-semibold">Secure Portal</span>
                        </div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Welcome back</h1>
                        <p className="text-slate-600 dark:text-foreground/60 font-medium">Sign in to your institutional account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
                                Institutional Email
                            </label>
                            <div className={`relative transition-all duration-200 ${focusedField === "email" ? "scale-[1.01]" : ""}`}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <AtSign className={`h-4 w-4 transition-colors ${focusedField === "email" ? "text-cyan-400" : "text-slate-600"}`} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField("email")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="name@university.ac.lk"
                                    disabled={loading}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-card border border-slate-200 dark:border-border rounded-2xl text-sm font-semibold text-foreground placeholder-slate-500 dark:placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60 focus:bg-white/8 transition-all disabled:opacity-40"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                                    Forgot?
                                </Link>
                            </div>
                            <div className={`relative transition-all duration-200 ${focusedField === "password" ? "scale-[1.01]" : ""}`}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className={`h-4 w-4 transition-colors ${focusedField === "password" ? "text-cyan-400" : "text-slate-600"}`} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField("password")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="••••••••"
                                    disabled={loading}
                                    className="block w-full pl-11 pr-12 py-3.5 bg-card border border-slate-200 dark:border-border rounded-2xl text-sm font-semibold text-foreground placeholder-slate-500 dark:placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60 focus:bg-white/8 transition-all disabled:opacity-40"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                <p className="text-sm font-semibold text-red-400 leading-tight">{error}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm font-medium text-slate-600">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                            Create Account
                        </Link>
                    </p>

                    {/* Demo Access */}
                    <div className="mt-6 pt-6 border-t border-white/5">
                        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">
                            Quick Demo Access
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {(["admin", "maintenance", "lecturer", "student"] as const).map((role) => (
                                <DemoButton key={role} role={role} onClick={() => setMockUser(role)} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

function DemoButton({ role, onClick }: { role: string; onClick: () => void }) {
    const router = useRouter();
    const handleClick = () => {
        onClick();
        router.push("/dashboard");
    };

    const colors: Record<string, string> = {
        admin: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300 hover:border-purple-400/50",
        maintenance: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300 hover:border-amber-400/50",
        lecturer: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-300 hover:border-emerald-400/50",
        student: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300 hover:border-blue-400/50",
    };

    return (
        <button
            onClick={handleClick}
            className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r border rounded-xl transition-all group ${colors[role] ?? colors.student}`}
        >
            <span className="text-xs font-black uppercase tracking-tight capitalize">{role}</span>
            <ArrowRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />
        </button>
    );
}
