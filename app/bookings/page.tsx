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
    MoreVertical
} from "lucide-react";

export default function BookingsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const bookings = [
        { title: "Advanced Robotics Lab", faculty: "Engineering", date: "Mar 12, 2026", time: "09:00 - 12:00", status: "Confirmed" },
        { title: "Organic Chemistry Lab", faculty: "Science", date: "Mar 13, 2026", time: "14:00 - 17:00", status: "Pending" },
        { title: "Lecture Hall A1", faculty: "Business", date: "Mar 15, 2026", time: "08:00 - 10:00", status: "Confirmed" },
        { title: "Fluid Mechanics Lab", faculty: "Engineering", date: "Mar 18, 2026", time: "11:00 - 13:00", status: "Cancelled" },
    ];

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Resource Bookings</h1>
                        <p className="text-slate-600 dark:text-foreground/50 font-medium italic">Manage and monitor facility schedules across all university faculties.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20 active:scale-95 whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" />
                        New Booking
                    </button>
                </header>

                {/* Filters & Search */}
                <div className="bg-card p-4 rounded-3xl border border-slate-200 dark:border-border shadow-sm mb-8 flex flex-col lg:flex-row gap-4 backdrop-blur-md">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-foreground/40 transition-colors group-focus-within:text-brand-primary" />
                        <input
                            type="text"
                            placeholder="Search by facility name or faculty..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-foreground/5 border border-slate-200 dark:border-border rounded-2xl text-sm font-bold text-foreground placeholder-slate-400 dark:placeholder-foreground/30 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 dark:border-border rounded-2xl text-sm font-black text-slate-600 dark:text-foreground/60 hover:bg-slate-100 dark:bg-foreground/5 transition-colors">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                        <button className="flex items-center gap-2 px-5 py-3 border border-slate-200 dark:border-border rounded-2xl text-sm font-black text-slate-600 dark:text-foreground/60 hover:bg-slate-100 dark:bg-foreground/5 transition-colors">
                            <Calendar className="w-4 h-4" />
                            March 2026
                        </button>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-card rounded-3xl border border-slate-200 dark:border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-foreground/[0.02] border-b border-slate-200 dark:border-border">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40">Resource / Facility</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40">Date & Time</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-foreground/40"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {bookings.map((booking, idx) => (
                                    <tr key={idx} className="hover:bg-foreground/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                                                    <MapPin className="w-5 h-5 text-brand-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-foreground">{booking.title}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 dark:text-foreground/40 uppercase tracking-wider">Faculty of {booking.faculty}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-foreground/70">
                                                    <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                                                    {booking.date}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-foreground/40">
                                                    <Clock className="w-3.5 h-3.5 text-brand-primary/60" />
                                                    {booking.time}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${booking.status === "Confirmed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                booking.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                                    "bg-red-50 text-red-600 border border-red-100"
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 hover:bg-slate-100 dark:bg-foreground/5 rounded-lg transition-colors text-slate-500 dark:text-foreground/40 hover:text-foreground">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 bg-foreground/[0.02] border-t border-slate-200 dark:border-border flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-500 dark:text-foreground/40 uppercase tracking-widest">Showing 4 of 28 bookings</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-slate-200 dark:border-border rounded-lg text-[10px] font-black uppercase tracking-widest bg-card text-slate-400 dark:text-foreground/20 cursor-not-allowed">Prev</button>
                            <button className="px-3 py-1 border border-slate-200 dark:border-border rounded-lg text-[10px] font-black uppercase tracking-widest bg-card text-slate-600 dark:text-foreground/60 hover:bg-slate-100 dark:bg-foreground/5 transition-colors">Next</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Booking Modal */}
            <NewBookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    // TODO: Refresh bookings list from Supabase
                    console.log("Booking created successfully!");
                }}
            />
        </ProtectedRoute>
    );
}

