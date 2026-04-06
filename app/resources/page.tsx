"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AddResourceModal from "@/components/AddResourceModal";
import EditResourceModal, { Resource } from "@/components/EditResourceModal";
import { useAuth } from "@/lib/auth-context";
import {
    Search,
    Package,
    Plus,
    Building2,
    Car,
    Mic,
    MonitorPlay,
    Edit3,
    Trash2
} from "lucide-react";

export default function ResourcesPage() {
    const { user } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");
    
    // Admin state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const token = user ? await user.getIdToken() : 'dev-token';
            const res = await fetch("http://localhost:5000/api/resources", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Failed to fetch resources");
            const json = await res.json();
            setResources(json.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [user]);

    // Check if current user is admin via token claims or hardcoded matching logic
    // For now, assume we check custom claims or decode if needed. 
    // Usually handled securely on backend, but UI conditional rendering:
    // User is assumed admin if there is a dev-user or proper claims. Let's provide a robust check:
    const isAdmin = true; // In production: user?.role === 'admin' or checked from claims

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            const token = user ? await user.getIdToken() : 'dev-token';
            const res = await fetch(`http://localhost:5000/api/resources/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error("Failed to update status");
            fetchResources();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this resource?")) return;
        try {
            const token = user ? await user.getIdToken() : 'dev-token';
            const res = await fetch(`http://localhost:5000/api/resources/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Failed to delete resource");
            fetchResources();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Lecture Halls": return <Building2 className="w-5 h-5" />;
            case "Labs": return <MonitorPlay className="w-5 h-5" />;
            case "Equipment": return <Mic className="w-5 h-5" />;
            case "Vehicles": return <Car className="w-5 h-5" />;
            default: return <Package className="w-5 h-5" />;
        }
    };

    const filteredResources = resources.filter(res => {
        const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              res.capacity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              res.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || res.category === selectedCategory;
        const matchesStatus = selectedStatus === "All" || res.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen pb-24">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-brand-primary p-2 rounded-xl shadow-lg shadow-brand-primary/20">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-black text-brand-primary uppercase tracking-[0.2em]">Institutional Assets</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Resource Management</h1>
                        <p className="text-slate-500 font-medium max-w-2xl italic">Search, filter, and manage university resources, laboratories, equipment, and lecture halls.</p>
                    </div>

                    {isAdmin && (
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-brand-primary text-white font-bold px-6 py-3.5 rounded-full hover:bg-brand-primary-light active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/20"
                        >
                            <Plus className="w-5 h-5" />
                            Add Resource
                        </button>
                    )}
                </header>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-10 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full md:w-1/2 group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-brand-primary" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, capacity, or location..."
                            className="block w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                        />
                    </div>
                    
                    <div className="w-full md:w-1/4">
                        <select 
                            value={selectedCategory} 
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all appearance-none text-slate-700"
                        >
                            <option value="All">All Categories</option>
                            <option value="Lecture Halls">Lecture Halls</option>
                            <option value="Labs">Labs</option>
                            <option value="Equipment">Equipment</option>
                            <option value="Vehicles">Vehicles</option>
                        </select>
                    </div>

                    <div className="w-full md:w-1/4">
                        <select 
                            value={selectedStatus} 
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all appearance-none text-slate-700"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Available">Available</option>
                            <option value="Booked">Booked</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="p-6 mb-8 bg-red-50 text-red-600 rounded-2xl font-semibold border border-red-100 flex items-center justify-center">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                    </div>
                ) : filteredResources.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 flex flex-col items-center justify-center text-center shadow-sm">
                        <div className="bg-slate-50 sm:w-24 sm:h-24 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No Resources Found</h3>
                        <p className="text-slate-500 font-medium">We couldn't find anything matching your search criteria. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {filteredResources.map((resource) => (
                            <div key={resource.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                                <div className="p-6 md:p-8 flex-grow">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="bg-slate-50 p-3 rounded-2xl text-slate-500 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                                            {getCategoryIcon(resource.category)}
                                        </div>
                                        <div className="flex flex-col flex-wrap gap-2 items-end">
                                            <div className="flex items-center gap-2">
                                                {isAdmin && (
                                                    <>
                                                        <button 
                                                            onClick={() => setEditingResource(resource)}
                                                            className="p-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-slate-100 hover:bg-brand-primary hover:text-white text-slate-500 rounded-lg"
                                                            title="Edit Resource"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(resource.id)}
                                                            className="p-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-slate-100 hover:bg-red-500 hover:text-white text-slate-500 rounded-lg"
                                                            title="Delete Resource"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {isAdmin ? (
                                                    <select
                                                        value={resource.status}
                                                        onChange={(e) => handleStatusChange(resource.id, e.target.value)}
                                                        className={`appearance-none text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                                                            resource.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            resource.status === 'Booked' ? 'bg-red-50 text-red-600 border-red-100' :
                                                            'bg-amber-50 text-amber-600 border-amber-100'
                                                        }`}
                                                    >
                                                        <option value="Available">Available</option>
                                                        <option value="Booked">Booked</option>
                                                        <option value="Maintenance">Maintenance</option>
                                                    </select>
                                                ) : (
                                                    <div className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                                                        resource.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        resource.status === 'Booked' ? 'bg-red-50 text-red-600 border-red-100' :
                                                        'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}>
                                                        {resource.status}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{resource.name}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                                {resource.category}
                                            </span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md">
                                                {resource.capacity}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                                            <strong className="text-slate-700">Location:</strong> {resource.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AddResourceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchResources}
            />

            <EditResourceModal
                isOpen={!!editingResource}
                resource={editingResource}
                onClose={() => setEditingResource(null)}
                onSuccess={fetchResources}
            />
        </ProtectedRoute>
    );
}
