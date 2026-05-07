"use client";

import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
    BarChart3,
    Users,
    Package,
    CalendarCheck,
    ArrowUpRight,
    TrendingUp,
    Clock,
    Wrench,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Settings,
    ShieldAlert
} from "lucide-react";

export default function DashboardPage() {
    const { profile } = useAuth();
    const role = profile?.role || "student";

    const statsConfig = {
        admin: [
            { label: "Total Bookings", value: "1,284", icon: <CalendarCheck className="w-5 h-5" />, trend: "+12%", color: "bg-blue-500" },
            { label: "Active Users", value: "842", icon: <Users className="w-5 h-5" />, trend: "+5%", color: "bg-purple-500" },
            { label: "Equipments", value: "52", icon: <Package className="w-5 h-5" />, trend: "Steady", color: "bg-emerald-500" },
            { label: "Resource Usage", value: "92%", icon: <BarChart3 className="w-5 h-5" />, trend: "+8%", color: "bg-amber-500" },
        ],
        maintenance: [
            { label: "Open Tickets", value: "12", icon: <AlertCircle className="w-5 h-5" />, trend: "-2", color: "bg-red-500" },
            { label: "In Progress", value: "5", icon: <Wrench className="w-5 h-5" />, trend: "+1", color: "bg-amber-500" },
            { label: "Completed", value: "48", icon: <CheckCircle2 className="w-5 h-5" />, trend: "+15%", color: "bg-emerald-500" },
            { label: "Critical Issues", value: "2", icon: <ShieldAlert className="w-5 h-5" />, trend: "Low", color: "bg-slate-900" },
        ],
        lecturer: [
            { label: "My Bookings", value: "8", icon: <Calendar className="w-5 h-5" />, trend: "Next: Lab 01", color: "bg-indigo-500" },
            { label: "Student Requests", value: "3", icon: <Users className="w-5 h-5" />, trend: "Pending", color: "bg-pink-500" },
            { label: "Assigned Resources", value: "4", icon: <Package className="w-5 h-5" />, trend: "Active", color: "bg-cyan-500" },
            { label: "Feedback", value: "12", icon: <TrendingUp className="w-5 h-5" />, trend: "Good", color: "bg-teal-500" },
        ],
        student: [
            { label: "My Bookings", value: "3", icon: <Calendar className="w-5 h-5" />, trend: "Active", color: "bg-orange-500" },
            { label: "Lab Access", value: "2", icon: <ShieldAlert className="w-5 h-5" />, trend: "Granted", color: "bg-violet-500" },
            { label: "Borrowed Items", value: "1", icon: <Package className="w-5 h-5" />, trend: "Due 2d", color: "bg-lime-500" },
            { label: "Notifications", value: "5", icon: <AlertCircle className="w-5 h-5" />, trend: "New", color: "bg-rose-500" },
        ]
    };

    const stats = statsConfig[role as keyof typeof statsConfig] || statsConfig.student;

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">
                            {role} Dashboard
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Welcome back, <span className="text-slate-900 font-bold">{profile?.name || "User"}</span>. Here's your status overview.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-colors">
                            <Settings className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${stat.color} text-white p-3 rounded-2xl shadow-lg shadow-current/20`}>
                                    {stat.icon}
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-50 rounded-full">
                                    {stat.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Role Specific Feed */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                {role === 'maintenance' ? 'Pending Assignments' : 'Recent Activity'}
                            </h3>
                            <button className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1 group">
                                View Full History
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {role === 'maintenance' ? (
                                <>
                                    <MaintenanceItem title="AC Repair - Block B" priority="High" time="1h ago" />
                                    <MaintenanceItem title="Projector Bulb Replacement" priority="Medium" time="3h ago" />
                                    <MaintenanceItem title="Lab Door Handle Fixed" priority="Low" status="Completed" time="5h ago" />
                                </>
                            ) : (
                                [1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                                <Clock className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Lab Booking Approved</p>
                                                <p className="text-xs font-medium text-slate-500">Resource: Physics Lab 01 • 2h ago</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full uppercase tracking-widest">Active</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-brand-primary opacity-20 rounded-full blur-3xl"></div>
                        <h3 className="text-xl font-bold mb-8 relative z-10">Quick Actions</h3>
                        <div className="space-y-3 relative z-10">
                            {role === 'maintenance' ? (
                                <>
                                    <DashboardAction label="View All Tickets" href="/maintenance" primary />
                                    <DashboardAction label="Create Incident Report" href="/maintenance/request" />
                                    <DashboardAction label="Update Schedule" href="/maintenance/timeline" />
                                </>
                            ) : role === 'admin' ? (
                                <>
                                    <DashboardAction label="Manage Resources" href="/resources" primary />
                                    <DashboardAction label="User Directory" href="/profile" />
                                    <DashboardAction label="Maintenance Console" href="/maintenance" />
                                </>
                            ) : (
                                <>
                                    <DashboardAction label="Book a Resource" href="/resources" primary />
                                    <DashboardAction label="Report an Issue" href="/maintenance/request" />
                                    <DashboardAction label="View My Bookings" href="/bookings" />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

function MaintenanceItem({ title, priority, status = "Pending", time }: { title: string, priority: string, status?: string, time: string }) {
    return (
        <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-brand-primary/20 transition-all group">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                    <Wrench className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-black text-slate-900">{title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${priority === 'High' ? 'bg-red-500 text-white' : 'bg-amber-400 text-slate-900'}`}>{priority} Priority</span>
                        <span className="text-[10px] text-slate-400 font-bold">• {time}</span>
                    </div>
                </div>
            </div>
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                {status}
            </span>
        </div>
    );
}

function DashboardAction({ label, href, primary }: { label: string, href: string, primary?: boolean }) {
    return (
        <Link
            href={href}
            className={`block w-full py-4 px-6 rounded-2xl text-sm font-bold transition-all text-center ${primary
                ? 'bg-brand-primary text-white hover:bg-brand-secondary shadow-lg shadow-brand-primary/20 hover:scale-[1.02]'
                : 'bg-white/10 hover:bg-white/20 border border-white/10 text-white hover:border-white/20'
                }`}
        >
            {label}
        </Link>
    );
}
