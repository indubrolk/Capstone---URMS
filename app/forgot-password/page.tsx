"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { AtSign, ArrowRight, ArrowLeft, X, CheckCircle } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        
        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess("Password reset link sent! Please check your inbox.");
            setEmail(""); // clear email on success
        } catch (err: unknown) {
            if (err instanceof Error) {
                if (err.message.includes("user-not-found")) {
                    setError("No account found with that email.");
                } else if (err.message.includes("invalid-email")) {
                    setError("Please enter a valid email address.");
                } else {
                    setError("Failed to send reset email. Please try again.");
                }
            } else {
                setError("An unexpected error occurred.");
            }
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
                        Regain <br />
                        Your Access.
                    </h2>
                    <p className="text-white/80 font-medium text-lg">
                        Securely reset your password and get back to managing your university resources.
                    </p>
                </div>
            </div>

            {/* Right Pane - Form */}
            <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-12">
                <div className="w-full max-w-sm">
                    <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to sign in
                    </Link>

                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Reset Password</h1>
                        <p className="text-slate-500 font-medium italic">Enter your email to receive a reset link</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                            disabled={loading || success !== null}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Send Reset Link
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
