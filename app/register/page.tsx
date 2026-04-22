"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, AtSign, Lock, Eye, EyeOff, ArrowRight, X, CheckCircle, BadgeCheck } from "lucide-react";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function RegisterPage() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!fullName || !email || !role || !password || !confirmPassword) {
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

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (fullName.trim()) {
                await updateProfile(userCredential.user, { displayName: fullName.trim() });
            }
            await sendEmailVerification(userCredential.user);
            setSuccess("Verification email sent. Please check your inbox before signing in.");
        } catch (err: unknown) {
            setError("Registration failed. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-white overflow-hidden">
            {/* Left Pane - Visual Cover */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-brand-primary overflow-hidden flex-col justify-end p-16">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop"
                        alt="University Campus Students"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-brand-secondary/40 to-transparent"></div>
                </div>

                <div className="relative z-10 flex flex-col gap-4 max-w-md">
                    <div className="bg-white p-2 rounded-xl w-fit shadow-xl border border-white/20">
                        <img
                            src="/urms-logo.png"
                            alt="URMS Logo"
                            className="w-10 h-10 object-contain"
                        />
                    </div>
                    <h2 className="text-4xl font-black text-white leading-tight">
                        Join the <br />
                        Campus Network.
                    </h2>
                    <p className="text-white/80 font-medium text-lg">
                        Create your account to access university resources and laboratory analytics.
                    </p>
                </div>
            </div>

            {/* Right Pane - Form */}
            <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-12">
                <div className="w-full max-w-sm">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h1>
                        <p className="text-slate-500 font-medium italic">Enter your details to register</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-brand-primary" />
                                </div>
                                <input
                                    id="fullName"
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Doe"
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all disabled:opacity-50"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Institutional Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <AtSign className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-brand-primary" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@university.ac.lk"
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all disabled:opacity-50"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="role" className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Select Role
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <BadgeCheck className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-brand-primary" />
                                </div>
                                <select
                                    id="role"
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="block w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all disabled:opacity-50 appearance-none text-slate-900"
                                    disabled={loading}
                                >
                                    <option value="" disabled>Select your role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Lecturer">Lecturer</option>
                                    <option value="Student">Student</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-brand-primary" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all disabled:opacity-50"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-widest text-slate-400">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-brand-primary" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all disabled:opacity-50"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="p-1 bg-red-500 rounded-full text-white">
                                    <X className="w-3" />
                                </div>
                                <p className="text-sm font-bold text-red-600 leading-tight">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="p-1 bg-emerald-500 rounded-full text-white">
                                    <CheckCircle className="w-3" />
                                </div>
                                <p className="text-sm font-bold text-emerald-700 leading-tight">{success}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Register
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-slate-500">
                        Already have an account? {" "}
                        <Link href="/login" className="font-bold text-brand-primary hover:underline transition-all">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
