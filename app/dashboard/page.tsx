"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
    BarChart3, Users, Package, CalendarCheck, AlertCircle,
    CheckCircle2, Calendar, ShieldAlert, Clock, BookOpen, PenTool
} from "lucide-react";

export default function DashboardPage() {
    const { profile } = useAuth();
    const role = profile?.role || "student";

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {role === "admin" && <AdminDashboard profile={profile} />}
                {role === "lecturer" && <LecturerDashboard profile={profile} />}
                {role === "student" && <StudentDashboard profile={profile} />}
                {role === "maintenance" && <MaintenanceDashboard profile={profile} />}
            </div>
        </ProtectedRoute>
    );
}

// ---------------------------------------------------------
// Admin Dashboard
// ---------------------------------------------------------
function AdminDashboard({ profile }: { profile: any }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="border-b border-slate-200 pb-6">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Console</h1>
                <p className="text-slate-500 mt-2">Welcome back, {profile?.name || "Admin"}. System overview is stable.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Active Users" value="842" icon={<Users className="w-6 h-6 text-brand-primary" />} />
                <StatCard title="Total Resources" value="156" icon={<Package className="w-6 h-6 text-brand-secondary" />} />
                <StatCard title="System Alerts" value="2" icon={<ShieldAlert className="w-6 h-6 text-brand-danger" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Platform Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="bg-brand-primary/10 p-2 rounded-lg text-brand-primary">
                                        <BarChart3 className="w-4 h-4" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700">New user registration approved</p>
                                </div>
                                <span className="text-xs text-slate-400">10m ago</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-900 rounded-2xl p-6 shadow-sm text-white">
                    <h3 className="text-lg font-bold mb-4">Management Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <ActionButton href="/profile" label="Manage Users" />
                        <ActionButton href="/resources" label="Edit Resources" />
                        <ActionButton href="/maintenance" label="View Tickets" />
                        <ActionButton href="/bookings" label="All Bookings" />
                        <ActionButton href="/admin/analytics" label="View Analytics" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------
// Lecturer (Teacher) Dashboard
// ---------------------------------------------------------
function LecturerDashboard({ profile }: { profile: any }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="bg-gradient-to-r from-indigo-50 to-white p-8 rounded-3xl border border-indigo-100">
                <h1 className="text-3xl font-black text-indigo-950 tracking-tight">Teacher Portal</h1>
                <p className="text-indigo-800 mt-2 font-medium">Hello, Dr. {profile?.name || "Lecturer"}. You have <span className="font-bold underline">3 pending approvals</span>.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Pending Requests
                    </h3>
                    <div className="flex-grow space-y-3">
                        <div className="p-4 border border-indigo-100 bg-indigo-50/50 rounded-xl flex justify-between items-center">
                            <div>
                                <p className="font-bold text-slate-900 text-sm">Advanced Physics Lab</p>
                                <p className="text-xs text-slate-500">Requested by John Doe</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-brand-danger hover:bg-slate-50">Deny</button>
                                <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700">Approve</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-600" /> My Upcoming Classes
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 p-3 rounded-xl border border-slate-100">
                            <div className="bg-indigo-100 text-indigo-800 font-bold p-3 rounded-lg text-center leading-tight">
                                <span className="block text-sm">OCT</span>
                                <span className="block text-xl">12</span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Quantum Mechanics 101</p>
                                <p className="text-sm text-slate-500">Main Lecture Hall • 10:00 AM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------
// Student Dashboard
// ---------------------------------------------------------
function StudentDashboard({ profile }: { profile: any }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Student Hub</h1>
                <p className="text-slate-500 mt-2 text-lg">Hi {profile?.name || "Student"}, ready to learn?</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-brand-primary rounded-3xl p-8 text-white shadow-xl shadow-brand-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20"><Calendar className="w-32 h-32" /></div>
                    <h3 className="text-xl font-bold mb-2 relative z-10">Next Booking</h3>
                    <p className="text-4xl font-black relative z-10 mb-1">Library Study Room B</p>
                    <p className="text-brand-primary-50 relative z-10 font-medium opacity-90">Today at 2:00 PM</p>
                    <button className="mt-8 bg-white text-brand-primary px-6 py-2 rounded-full font-bold text-sm relative z-10 hover:bg-slate-50 transition-colors">
                        View Details
                    </button>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Links</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/resources" className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100">
                            <BookOpen className="w-8 h-8 text-brand-primary mb-3" />
                            <span className="font-bold text-slate-700 text-sm">Browse Labs</span>
                        </Link>
                        <Link href="/bookings" className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100">
                            <Clock className="w-8 h-8 text-brand-secondary mb-3" />
                            <span className="font-bold text-slate-700 text-sm">My History</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------
// Maintenance Dashboard
// ---------------------------------------------------------
function MaintenanceDashboard({ profile }: { profile: any }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex justify-between items-end border-b border-red-100 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <PenTool className="w-8 h-8 text-brand-danger" /> Operations Hub
                    </h1>
                    <p className="text-slate-500 mt-2">Maintenance team active. 2 High priority tickets.</p>
                </div>
                <button className="bg-brand-danger text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors">
                    Report Incident
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                    <h3 className="text-red-900 font-bold text-lg mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" /> Critical Tasks
                    </h3>
                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-bold text-slate-900">Projector Malfunction</p>
                                <p className="text-xs text-slate-500">Lecture Hall A</p>
                            </div>
                            <span className="bg-red-100 text-red-700 text-xs font-black uppercase px-2 py-1 rounded">Urgent</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-slate-900 font-bold text-lg mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Standard Queue
                    </h3>
                    <div className="space-y-3">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-slate-900">AC Filter Replacement</p>
                                <p className="text-xs text-slate-500">Computer Lab 3</p>
                            </div>
                            <span className="bg-slate-200 text-slate-600 text-xs font-black uppercase px-2 py-1 rounded">Routine</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------
// Shared UI Components
// ---------------------------------------------------------
function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                {icon}
            </div>
            <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-black text-slate-900">{value}</p>
            </div>
        </div>
    );
}

function ActionButton({ href, label }: { href: string, label: string }) {
    return (
        <Link href={href} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm py-3 px-4 rounded-xl text-center transition-colors">
            {label}
        </Link>
    );
}
