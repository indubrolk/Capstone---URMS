"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { User as UserIcon, Mail, Shield, Save, Edit2, Loader2, X, CheckCircle } from "lucide-react";

interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: string;
}

export default function ProfilePage() {
    const { user } = useAuth();
    
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form state
    const [displayName, setDisplayName] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            try {
                const token = await user.getIdToken();
                const res = await fetch("http://localhost:5000/api/users/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch profile");
                }

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
            const token = await user.getIdToken();
            const res = await fetch("http://localhost:5000/api/users/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ displayName: displayName.trim() })
            });

            if (!res.ok) {
                throw new Error("Failed to update profile");
            }

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

    return (
        <ProtectedRoute>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">My Profile</h1>
                    <p className="text-slate-500 font-medium">Manage your personal information and account settings.</p>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                    </div>
                ) : profile ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Profile Header Background */}
                        <div className="h-32 bg-brand-primary/10 relative">
                            <div className="absolute -bottom-12 left-8">
                                <div className="h-24 w-24 bg-brand-primary text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-white text-4xl font-black">
                                    {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : <UserIcon className="w-10 h-10" />}
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 px-8 pb-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">{profile.displayName || "Unknown User"}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-brand-primary/10 text-brand-primary uppercase tracking-wider">
                                            <Shield className="w-3.5 h-3.5" />
                                            {profile.role}
                                        </span>
                                    </div>
                                </div>
                                {!isEditing && (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            {error && (
                                <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                                    <div className="p-1 bg-red-500 rounded-full text-white">
                                        <X className="w-3 h-3" />
                                    </div>
                                    <p className="text-sm font-bold text-red-600">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="mb-6 bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3">
                                    <div className="p-1 bg-emerald-500 rounded-full text-white">
                                        <CheckCircle className="w-3 h-3" />
                                    </div>
                                    <p className="text-sm font-bold text-emerald-700">{success}</p>
                                </div>
                            )}

                            {isEditing ? (
                                <form onSubmit={handleSave} className="space-y-6 max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="space-y-2">
                                        <label htmlFor="displayName" className="text-xs font-black uppercase tracking-widest text-slate-400">
                                            Full Name
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <UserIcon className="h-5 w-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                                            </div>
                                            <input
                                                id="displayName"
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                                disabled={saveLoading}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 opacity-60">
                                        <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400">
                                            Email Address (Read-only)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                value={profile.email}
                                                disabled
                                                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                                        <button
                                            type="submit"
                                            disabled={saveLoading}
                                            className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-secondary transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                        >
                                            {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setDisplayName(profile.displayName);
                                                setError(null);
                                            }}
                                            disabled={saveLoading}
                                            className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 font-bold px-6 py-3 rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3 mb-1">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 pl-7">{profile.email}</p>
                                    </div>
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3 mb-1">
                                            <Shield className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Assigned Role</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 pl-7 capitalize">{profile.role}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                        <p className="text-slate-500 font-medium">Failed to load profile data.</p>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
