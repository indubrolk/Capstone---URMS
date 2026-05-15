"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import NewBookingModal from "@/components/NewBookingModal";
import {
    Plus,
    Search,
    Filter,
    Calendar,
    Clock,
    MapPin,
    MoreVertical,
    CheckCircle2,
    Clock4,
    XCircle,
    CalendarCheck,
    ChevronRight,
    ChevronLeft,
    TrendingUp
} from "lucide-react";

export default function BookingsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const stats = [
        { label: "Total Bookings", value: "128", trend: "+12%", icon: <CalendarCheck className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50", border: "border-blue-100" },
        { label: "Pending", value: "14", trend: "-2%", icon: <Clock4 className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50", border: "border-amber-100" },
        { label: "Confirmed", value: "109", trend: "+15%", icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50", border: "border-emerald-100" },
        { label: "Cancelled", value: "5", trend: "-5%", icon: <XCircle className="w-5 h-5 text-red-600" />, bg: "bg-red-50", border: "border-red-100" },
    ];

    const bookings = [
        { title: "Advanced Robotics Lab", faculty: "Engineering", date: "Mar 12, 2026", time: "09:00 - 12:00", status: "Confirmed", image: "https://images.unsplash.com/photo-1581092334397-e9d49c5bb038?auto=format&fit=crop&q=80&w=100&h=100" },
        { title: "Organic Chemistry Lab", faculty: "Science", date: "Mar 13, 2026", time: "14:00 - 17:00", status: "Pending", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=100&h=100" },
        { title: "Lecture Hall A1", faculty: "Business", date: "Mar 15, 2026", time: "08:00 - 10:00", status: "Confirmed", image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=100&h=100" },
        { title: "Fluid Mechanics Lab", faculty: "Engineering", date: "Mar 18, 2026", time: "11:00 - 13:00", status: "Cancelled", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=100&h=100" },
        { title: "Computer Science Lab 3", faculty: "Computing", date: "Mar 20, 2026", time: "10:00 - 12:00", status: "Confirmed", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=100&h=100" },
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 overflow-x-hidden">
                <style>{`
                    @keyframes slide-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                    .s1 { animation: slide-up .5s ease .05s both; }
                    .s2 { animation: slide-up .5s ease .15s both; }
                    .s3 { animation: slide-up .5s ease .25s both; }
                    .ch { transition: all .25s cubic-bezier(.4,0,.2,1); }
                    .ch:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,.08); }
                    .row-hover { transition: all .2s ease; }
                    .row-hover:hover { background-color: #f8fafc; transform: scale-[1.01]; box-shadow: 0 4px 12px rgba(0,0,0,.05); border-radius: 1rem; z-index: 10; position: relative; border-color: transparent; }
                `}</style>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                    
                    {/* ══════════════════════════════════════════════
                        HERO SECTION
                    ══════════════════════════════════════════════ */}
                    <div className="s1 relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-700 to-blue-800 rounded-[2.5rem] p-8 sm:p-10 text-white shadow-2xl shadow-indigo-500/20">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 2px, transparent 2px)", backgroundSize: "32px 32px" }} />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4 backdrop-blur-md">
                                    <CalendarCheck className="w-4 h-4 text-indigo-200" />
                                    <span className="text-indigo-100 text-xs font-bold tracking-wide uppercase">Reservations</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 leading-tight">
                                    Resource Bookings
                               </h1>
                                <p className="text-indigo-100/90 font-medium text-lg max-w-xl">
                                    Manage, track, and schedule facility reservations across all university faculties in real-time.
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="group shrink-0 inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-black px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                                    <Plus className="w-5 h-5" />
                                </div>
                                New Booking
                            </button>
                        </div>
                    </div>

                    {/* ══════════════════════════════════════════════
                        STATS GRID
                    ══════════════════════════════════════════════ */}
                    <div className="s2 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className={`ch bg-white rounded-3xl border ${stat.border} p-6 shadow-sm relative overflow-hidden group`}>
                                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} opacity-50 group-hover:scale-150 transition-transform duration-500`} />
                                <div className="relative z-10 flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                                        {stat.icon}
                                    </div>
                                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${stat.trend.startsWith('+') ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'}`}>
                                        <TrendingUp className={`w-3 h-3 ${stat.trend.startsWith('-') && 'rotate-180'}`} />
                                        {stat.trend}
                                    </span>
                                </div>
                                <p className="relative z-10 text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                                <p className="relative z-10 text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* ══════════════════════════════════════════════
                        MAIN CONTENT AREA
                    ══════════════════════════════════════════════ */}
                    <div className="s3 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-4 sm:p-8">
                        
                        {/* Toolbar */}
                        <div className="flex flex-col lg:flex-row gap-4 mb-8">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by facility name, faculty, or booking ID..."
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/30 transition-all hover:bg-slate-100/50"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
                                    <Filter className="w-4 h-4" />
                                    Filter
                                </button>
                                <button className="flex items-center gap-2 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors">
                                    <Calendar className="w-4 h-4" />
                                    Select Date
                                </button>
                            </div>
                        </div>

                        {/* List View */}
                        <div className="space-y-2">
                            {/* Header row */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                <div className="col-span-5">Resource Details</div>
                                <div className="col-span-3">Schedule</div>
                                <div className="col-span-3">Status</div>
                                <div className="col-span-1 text-right">Actions</div>
                            </div>

                            {/* Booking items */}
                            {bookings.map((booking, idx) => (
                                <div key={idx} className="row-hover grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 border border-slate-100 md:border-transparent rounded-2xl bg-white">
                                    
                                    {/* Resource Info */}
                                    <div className="col-span-1 md:col-span-5 flex items-center gap-4">
                                        <img 
                                            src={booking.image} 
                                            alt={booking.title} 
                                            className="w-14 h-14 rounded-xl object-cover shadow-sm bg-slate-100 shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{booking.title}</p>
                                            <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-slate-500">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span className="truncate">Faculty of {booking.faculty}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date & Time */}
                                    <div className="col-span-1 md:col-span-3">
                                        <div className="inline-flex flex-col gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                                {booking.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                {booking.time}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="col-span-1 md:col-span-3">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                                            booking.status === "Confirmed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                            booking.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                            "bg-red-50 text-red-700 border-red-200"
                                        }`}>
                                            {booking.status === "Confirmed" && <CheckCircle2 className="w-3.5 h-3.5" />}
                                            {booking.status === "Pending" && <Clock4 className="w-3.5 h-3.5" />}
                                            {booking.status === "Cancelled" && <XCircle className="w-3.5 h-3.5" />}
                                            {booking.status}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 md:col-span-1 flex justify-end">
                                        <button className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors shadow-sm">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Showing <span className="text-slate-900">1</span> to <span className="text-slate-900">5</span> of <span className="text-slate-900">28</span> bookings
                            </p>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-not-allowed opacity-50">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors bg-white shadow-sm">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Booking Modal */}
                <NewBookingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        // TODO: Refresh bookings list
                        console.log("Booking created successfully!");
                    }}
                />
            </div>
        </ProtectedRoute>
    );
}
