"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
    Search,
    Filter,
    Package,
    CheckCircle2,
    AlertCircle,
    Tag,
    ArrowUpRight,
    Landmark
} from "lucide-react";

export default function ResourcesPage() {
    const resources = [
        { name: "Scanning Electron Microscope", faculty: "Science", category: "High-end Lab Equipments", condition: "Excellent", status: "Available" },
        { name: "3D Printer Pro V2", faculty: "Engineering", category: "Fabrication tools", condition: "Maintenance", status: "Unavailable" },
        { name: "Centrifuge Model X", faculty: "Science", category: "Lab Instruments", condition: "Fair", status: "Available" },
        { name: "Virtual Reality Suite", faculty: "IT", category: "Specialized Labs", condition: "New", status: "Reserved" },
        { name: "Mass Spectrometer", faculty: "Science", category: "High-end Lab Equipments", condition: "Critical", status: "Maintenance" },
        { name: "Hydraulic Press", faculty: "Engineering", category: "Heavy Machinery", condition: "Good", status: "Available" },
    ];

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-brand-primary p-2 rounded-xl shadow-lg shadow-brand-primary/20">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-black text-brand-primary uppercase tracking-[0.2em]">Institutional Assets</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Campus Resources</h1>
                    <p className="text-slate-500 font-medium max-w-2xl italic">Directory of specialized tools, laboratories, and lecture halls available across the university network.</p>
                </header>

                {/* Global Search */}
                <div className="relative mb-12 group max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-slate-400 transition-colors group-focus-within:text-brand-primary" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search resources, serial numbers, categories..."
                        className="block w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl text-lg font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-8 focus:ring-brand-primary/5 focus:border-brand-primary transition-all shadow-sm"
                    />
                </div>

                {/* Resource Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map((resource, idx) => (
                        <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group">
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                                        <Tag className="w-6 h-6" />
                                    </div>
                                    <button className="text-slate-300 group-hover:text-brand-primary transition-colors">
                                        <ArrowUpRight className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{resource.name}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                            {resource.faculty}
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary bg-brand-primary/5 px-2 py-1 rounded-md border border-brand-primary/10">
                                            {resource.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {resource.status === "Available" ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-amber-500" />
                                        )}
                                        <span className={`text-sm font-bold tracking-tight ${resource.status === "Available" ? "text-emerald-600" : "text-amber-600"
                                            }`}>
                                            {resource.status}
                                        </span>
                                    </div>
                                    <div className="text-xs font-bold text-slate-400 italic">
                                        Condition: <span className="text-slate-600">{resource.condition}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination / Load More */}
                <div className="mt-16 flex justify-center">
                    <button className="px-10 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95 shadow-xl">
                        Load More Assets
                        <ArrowUpRight className="w-5 h-5 opacity-50" />
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
}
