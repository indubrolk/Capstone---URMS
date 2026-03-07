"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Landmark, AtSign, Lock, Eye, EyeOff, ArrowRight, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
    const { signIn } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
        <div className="flex min-h-[calc(100vh-64px)] bg-white overflow-hidden">
            {/* Left Pane - Visual Cover */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-brand-primary overflow-hidden flex-col justify-end p-16">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop"
                        alt="University Campus"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary via-brand-secondary/40 to-transparent"></div>
                </div>

                <div className="relative z-10 flex flex-col gap-4 max-w-md">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl w-fit">
                        <Landmark className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-white leading-tight">
                        Streamlining <br />
                        Campus Evolution.
                    </h2>
                    <p className="text-white/80 font-medium text-lg">
                        Access the centralized hub for university resource management and laboratory analytics.
                    </p>
                </div>
            </div>

            {/* Right Pane - Form */}
            <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-12">
                <div className="w-full max-w-sm">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome back</h1>
                        <p className="text-slate-500 font-medium italic">Please enter your credentials</p>
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

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Password
                                </label>
                                <Link href="#" className="text-xs font-bold text-brand-primary hover:underline">Forgot?</Link>
                            </div>
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

                        {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="p-1 bg-red-500 rounded-full text-white">
                                    <X className="w-3" />
                                </div>
                                <p className="text-sm font-bold text-red-600 leading-tight">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-sm font-medium text-slate-500">
                        Internal Portal. Need access? {" "}
                        <Link href="#" className="font-bold text-brand-primary hover:underline transition-all">Request Credentials</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
