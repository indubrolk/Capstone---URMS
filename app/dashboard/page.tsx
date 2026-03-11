"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
    BarChart3,
    Users,
    Package,
    CalendarCheck,
    ArrowUpRight,
    TrendingUp,
    Clock
} from "lucide-react";

export default function DashboardPage() {
    const stats = [
        { label: "Total Bookings", value: "1,284", icon: <CalendarCheck className="w-5 h-5" />, trend: "+12%", color: "bg-blue-500" },
        { label: "Active Users", value: "842", icon: <Users className="w-5 h-5" />, trend: "+5%", color: "bg-purple-500" },
        { label: "Equipments", value: "52", icon: <Package className="w-5 h-5" />, trend: "Steady", color: "bg-emerald-500" },
        { label: "Resource Usage", value: "92%", icon: <BarChart3 className="w-5 h-5" />, trend: "+8%", color: "bg-amber-500" },
    ];

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">System Overview</h1>
                    <p className="text-slate-500 font-medium">Welcome back, administrator. Here's what's happening today.</p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${stat.color} text-white p-2.5 rounded-2xl shadow-lg shadow-current/20`}>
                                    {stat.icon}
                                </div>
                                <div className="flex items-center gap-1 text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3" />
                                    {stat.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500 mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Activity</h3>
                            <button className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1 group">
                                View All
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Lab Booking Request</p>
                                            <p className="text-xs font-medium text-slate-500 italic">Faculty of Engineering • 2h ago</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black px-3 py-1 bg-amber-50 text-amber-600 rounded-full">Pending</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-brand-primary opacity-20 rounded-full blur-3xl"></div>
                        <h3 className="text-xl font-bold mb-6 relative z-10">Quick Actions</h3>
                        <div className="space-y-4 relative z-10">
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-left px-5 font-bold transition-colors">
                                New Resource Allocation
                            </button>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-left px-5 font-bold transition-colors">
                                Generate Monthly Report
                            </button>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-left px-5 font-bold transition-colors">
                                System Health Check
                            </button>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-left px-5 font-bold transition-colors">
                                Broadcast Announcement
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
