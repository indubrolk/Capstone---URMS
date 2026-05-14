"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, AtSign, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Sparkles, BadgeCheck, ChevronDown, ChevronLeft } from "lucide-react";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserProfile } from "@/lib/supabase";

function Orb({ className }: { className: string }) {
    return <div className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`} />;
}

/* password strength meter */
function PasswordStrength({ password }: { password: string }) {
    const strength = password.length === 0 ? 0
        : password.length < 6 ? 1
        : password.length < 8 ? 2
        : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4
        : 3;

    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    const colors = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];
    const textColors = ["", "text-red-400", "text-amber-400", "text-blue-400", "text-emerald-400"];

    if (!password) return null;

    return (
        <div className="mt-2 space-y-1.5">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : "bg-slate-200 dark:bg-white/10"}`}
                    />
                ))}
            </div>
            <p className={`text-xs font-semibold ${textColors[strength]}`}>{labels[strength]}</p>
        </div>
    );
}

export default function RegisterPage() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [department, setDepartment] = useState(""); // Added for department-wise analytics
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const validateForm = () => {
        if (!fullName || !email || !role || !department || !password || !confirmPassword) {
            setError("All fields are required.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return false;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return false;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!validateForm()) return;

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            if (fullName.trim()) {
                await updateProfile(userCredential.user, { displayName: fullName.trim() });
            }

            await createUserProfile({
                id: uid,
                name: fullName.trim(),
                email: email.toLowerCase(),
                role: role.toLowerCase() as any,
                department: department // Persist department
            });

            setSuccess("Account created! Redirecting to sign in…");
            setTimeout(() => router.push("/login"), 1500);
        } catch (err: unknown) {
            if (err instanceof Error) {
                const code = (err as { code?: string }).code ?? "";
                if (code.includes("email-already-in-use")) {
                    setError("An account with this email already exists. Please sign in instead.");
                } else if (code.includes("weak-password")) {
                    setError("Password is too weak. Use at least 8 characters.");
                } else if (code.includes("invalid-email")) {
                    setError("The email address is not valid.");
                } else if (code.includes("network-request-failed")) {
                    setError("Network error. Check your connection and try again.");
                } else {
                    setError("Registration failed. Please try again.");
                }
                console.error(err);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const inputBase = "block w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-foreground/5 border border-slate-200 dark:border-border rounded-2xl text-sm font-bold text-foreground placeholder-slate-400 dark:placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary/60 focus:bg-foreground/[0.08] transition-all disabled:opacity-40";

    return (
        <div className="flex h-screen overflow-hidden bg-background">

            {/* ══════════════ LEFT PANEL ══════════════ */}
            <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-card/80 via-card/50 to-background" />
                <Orb className="w-96 h-96 bg-brand-primary/10 -top-20 -left-20" />
                <Orb className="w-64 h-64 bg-indigo-500/5 bottom-40 right-10" />
                <Orb className="w-48 h-48 bg-sky-400/5 top-1/2 left-1/4" />

                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop"
                        alt="University Campus Students"
                        className="w-full h-full object-cover opacity-10 mix-blend-luminosity"
                    />
                </div>

                {/* pill badge */}
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-foreground/5 backdrop-blur border border-slate-200 dark:border-border rounded-full px-4 py-2">
                        <Sparkles className="w-4 h-4 text-brand-primary" />
                        <span className="text-slate-600 dark:text-foreground/60 text-[10px] font-black uppercase tracking-widest">Join the Campus Network</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-5xl font-black text-foreground leading-[1.1] tracking-tight mb-5">
                            Start your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-indigo-500">
                                Campus Journey.
                            </span>
                        </h2>
                        <p className="text-slate-600 dark:text-foreground/50 text-lg font-medium leading-relaxed max-w-sm">
                            Create your account to access university resources, lab bookings, and analytics.
                        </p>
                    </div>

                    {/* steps */}
                    <div className="space-y-2">
                        {[
                            { step: "01", title: "Create Account", desc: "Fill in your details below" },
                            { step: "02", title: "Verify Email", desc: "Check your inbox" },
                            { step: "03", title: "Access Resources", desc: "Start booking & managing" },
                        ].map((s) => (
                            <div key={s.step} className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0">
                                    <span className="text-brand-primary text-[10px] font-black">{s.step}</span>
                                </div>
                                <div>
                                    <p className="text-foreground font-black text-sm">{s.title}</p>
                                    <p className="text-slate-500 dark:text-foreground/40 text-[10px] font-black uppercase tracking-widest">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══════════════ RIGHT PANEL ══════════════ */}
            <div className="flex w-full lg:w-[52%] flex-col p-4 sm:p-6 relative overflow-y-auto">
                {/* Back to Home Link */}
                <div className="flex justify-start mb-4">
                    <Link 
                        href="/" 
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-foreground/5 hover:bg-slate-200 dark:bg-foreground/10 border border-slate-200 dark:border-border text-slate-700 dark:text-foreground/70 hover:text-foreground text-[10px] font-black uppercase tracking-widest transition-all group z-20"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-background -z-10" />
                    <Orb className="w-64 h-64 bg-brand-primary top-0 left-0 opacity-5" />

                    <div className="relative z-10 w-full max-w-sm">

                    <div className="mb-4">
                        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-3 py-1 mb-5">
                            <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                            <span className="text-brand-primary text-[10px] font-black uppercase tracking-widest">New Account</span>
                        </div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Create Account</h1>
                        <p className="text-slate-600 dark:text-foreground/50 font-medium">Enter your details to register</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>

                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40 mb-1">
                                Full Name
                            </label>
                            <div className={`relative transition-all duration-200 ${focusedField === "fullName" ? "scale-[1.01]" : ""}`}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className={`h-4 w-4 transition-colors ${focusedField === "fullName" ? "text-brand-primary" : "text-slate-400 dark:text-foreground/30"}`} />
                                </div>
                                <input
                                    id="fullName"
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    onFocus={() => setFocusedField("fullName")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="John Doe"
                                    disabled={loading}
                                    className={inputBase}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40 mb-1">
                                Institutional Email
                            </label>
                            <div className={`relative transition-all duration-200 ${focusedField === "email" ? "scale-[1.01]" : ""}`}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <AtSign className={`h-4 w-4 transition-colors ${focusedField === "email" ? "text-brand-primary" : "text-slate-400 dark:text-foreground/30"}`} />
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
                                    className={inputBase}
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="role" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40 mb-1">
                                Select Role
                            </label>
                            <div className={`relative transition-all duration-200 ${focusedField === "role" ? "scale-[1.01]" : ""}`}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <BadgeCheck className={`h-4 w-4 transition-colors ${focusedField === "role" ? "text-brand-primary" : "text-slate-400 dark:text-foreground/30"}`} />
                                </div>
                                <select
                                    id="role"
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    onFocus={() => setFocusedField("role")}
                                    onBlur={() => setFocusedField(null)}
                                    disabled={loading}
                                    className={`${inputBase} pr-10 appearance-none ${!role ? "text-slate-400 dark:text-foreground/30" : ""}`}
                                >
                                    <option value="" disabled className="bg-card text-slate-500 dark:text-foreground/40">Select your role</option>
                                    <option value="Admin" className="bg-card text-foreground">Admin</option>
                                    <option value="Lecturer" className="bg-card text-foreground">Lecturer</option>
                                    <option value="Student" className="bg-card text-foreground">Student</option>
                                    <option value="Maintenance" className="bg-card text-foreground">Maintenance</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <ChevronDown className="h-4 w-4 text-slate-400 dark:text-foreground/30" />
                                </div>
                            </div>
                        </div>

                        {/* Department/Faculty */}
                        <div>
                            <label htmlFor="department" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40 mb-1">
                                Faculty / Department
                            </label>
                            <div className={`relative transition-all duration-200 ${focusedField === "department" ? "scale-[1.01]" : ""}`}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Sparkles className={`h-4 w-4 transition-colors ${focusedField === "department" ? "text-brand-primary" : "text-slate-400 dark:text-foreground/30"}`} />
                                </div>
                                <select
                                    id="department"
                                    required
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    onFocus={() => setFocusedField("department")}
                                    onBlur={() => setFocusedField(null)}
                                    disabled={loading}
                                    className={`${inputBase} pr-10 appearance-none ${!department ? "text-slate-400 dark:text-foreground/30" : ""}`}
                                >
                                    <option value="" disabled className="bg-card text-slate-500 dark:text-foreground/40">Select your faculty</option>
                                    <option value="Faculty of Computing" className="bg-card text-foreground">Faculty of Computing</option>
                                    <option value="Faculty of Applied Sciences" className="bg-card text-foreground">Faculty of Applied Sciences</option>
                                    <option value="Faculty of Management" className="bg-card text-foreground">Faculty of Management</option>
                                    <option value="Faculty of Engineering" className="bg-card text-foreground">Faculty of Engineering</option>
                                    <option value="Faculty of Business" className="bg-card text-foreground">Faculty of Business</option>
                                    <option value="Faculty of Medicine" className="bg-card text-foreground">Faculty of Medicine</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <ChevronDown className="h-4 w-4 text-slate-400 dark:text-foreground/30" />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40 mb-1">
                                Password
                            </label>
                            <div className={`relative transition-all duration-200 ${focusedField === "password" ? "scale-[1.01]" : ""}`}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className={`h-4 w-4 transition-colors ${focusedField === "password" ? "text-brand-primary" : "text-slate-400 dark:text-foreground/30"}`} />
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
                                    className={`${inputBase} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 dark:text-foreground/30 hover:text-brand-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <PasswordStrength password={password} />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40 mb-1">
                                Confirm Password
                            </label>
                            <div className={`relative transition-all duration-200 ${focusedField === "confirm" ? "scale-[1.01]" : ""}`}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className={`h-4 w-4 transition-colors ${focusedField === "confirm" ? "text-brand-primary" : "text-slate-400 dark:text-foreground/30"}`} />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onFocus={() => setFocusedField("confirm")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="••••••••"
                                    disabled={loading}
                                    className={`${inputBase} pr-12 ${confirmPassword && confirmPassword === password ? "border-emerald-500/40" : ""}`}
                                />
                                {confirmPassword && confirmPassword === password && (
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Error / Success */}
                        {error && (
                            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                <p className="text-sm font-semibold text-red-400 leading-tight">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <p className="text-sm font-semibold text-emerald-400 leading-tight">{success}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40">
                        Already have an account?{" "}
                        <Link href="/login" className="font-black text-brand-primary hover:text-indigo-500 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
    );
}
