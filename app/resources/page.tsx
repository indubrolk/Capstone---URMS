"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import AddResourceModal from "@/components/AddResourceModal";
import EditResourceModal, { Resource } from "@/components/EditResourceModal";
import BulkImport from "@/components/BulkImport";
import { useAuth } from "@/lib/auth-context";
import {
    Search,
    Plus,
    Edit3,
    Trash2,
    Database,
    CheckCircle2,
    XCircle,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    FlaskConical,
    Building2,
    DoorOpen,
    Package,
    UploadCloud,
} from "lucide-react";

type SortField = "name" | "type" | "capacity" | "availability_status";
type SortDir = "asc" | "desc";

export default function ResourcesPage() {
    const { user } = useAuth();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortDir, setSortDir] = useState<SortDir>("asc");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const isAdmin = true;

    const fetchResources = async () => {
        setLoading(true);
        try {
            const token = (user && typeof user.getIdToken === 'function') ? await user.getIdToken() : "dev-token";
            const res = await fetch("http://localhost:5000/api/resources", {
                headers: { Authorization: `Bearer ${token}` },
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

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this resource?")) return;
        setDeletingId(id);
        try {
            const token = (user && typeof user.getIdToken === 'function') ? await user.getIdToken() : "dev-token";
            const res = await fetch(`http://localhost:5000/api/resources/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to delete resource");
            }
            fetchResources();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "Labs": return <FlaskConical className="w-4 h-4" />;
            case "Lecture Halls": return <Building2 className="w-4 h-4" />;
            case "Rooms": return <DoorOpen className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Labs": return "bg-purple-50 text-purple-700 border-purple-100";
            case "Lecture Halls": return "bg-blue-50 text-blue-700 border-blue-100";
            case "Rooms": return "bg-teal-50 text-teal-700 border-teal-100";
            default: return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };

    const filteredResources = resources
        .filter((r) => {
            const q = searchQuery.toLowerCase();
            const matchSearch =
                r.name.toLowerCase().includes(q) ||
                r.type.toLowerCase().includes(q) ||
                r.location?.toLowerCase().includes(q);
            const matchCat = selectedCategory === "All" || r.type === selectedCategory;
            const matchStatus = selectedStatus === "All" || r.availability_status === selectedStatus;
            return matchSearch && matchCat && matchStatus;
        })
        .sort((a, b) => {
            const av = (a[sortField] ?? "").toString().toLowerCase();
            const bv = (b[sortField] ?? "").toString().toLowerCase();
            return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
        });

    const totalResources = resources.length;
    const available = resources.filter((r) => r.availability_status === "Available").length;
    const booked = resources.filter((r) => r.availability_status === "Booked").length;

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
        return sortDir === "asc"
            ? <ChevronUp className="w-3.5 h-3.5 text-brand-primary" />
            : <ChevronDown className="w-3.5 h-3.5 text-brand-primary" />;
    };

    return (
        <ProtectedRoute>
            {/* Dashboard wrapper */}
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">

                    {/* ── Page Header ── */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-foreground tracking-tight">Resources</h1>
                            <p className="text-slate-600 dark:text-foreground/50 mt-1 text-sm font-medium">Manage university resources, labs, and halls</p>
                        </div>
                        {isAdmin && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsBulkImportOpen(true)}
                                    className="inline-flex items-center gap-2 bg-card border border-slate-200 dark:border-border hover:bg-slate-100 dark:bg-foreground/5 active:scale-95 text-slate-700 dark:text-foreground/80 font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200"
                                >
                                    <UploadCloud className="w-4 h-4" />
                                    Bulk Import
                                </button>
                                <button
                                    id="add-resource-btn"
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="inline-flex items-center gap-2 bg-brand-primary hover:opacity-90 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-brand-primary/20 transition-all duration-200"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Resource
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Stats Cards ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                        {/* Total */}
                        <div className="bg-card rounded-2xl shadow-sm border border-slate-200 dark:border-border p-6 flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                                <Database className="w-6 h-6 text-brand-primary" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 dark:text-foreground/40 uppercase tracking-widest">Total Resources</p>
                                <p className="text-3xl font-black text-foreground mt-0.5">
                                    {loading ? <span className="text-xl text-slate-400 dark:text-foreground/20">—</span> : totalResources}
                                </p>
                            </div>
                        </div>

                        {/* Available */}
                        <div className="bg-card rounded-2xl shadow-sm border border-slate-200 dark:border-border p-6 flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 dark:text-foreground/40 uppercase tracking-widest">Available</p>
                                <p className="text-3xl font-black text-emerald-500 mt-0.5">
                                    {loading ? <span className="text-xl text-slate-400 dark:text-foreground/20">—</span> : available}
                                </p>
                            </div>
                        </div>

                        {/* Booked */}
                        <div className="bg-card rounded-2xl shadow-sm border border-slate-200 dark:border-border p-6 flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                                <XCircle className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 dark:text-foreground/40 uppercase tracking-widest">Booked</p>
                                <p className="text-3xl font-black text-red-500 mt-0.5">
                                    {loading ? <span className="text-xl text-slate-400 dark:text-foreground/20">—</span> : booked}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Search & Filters ── */}
                    <div className="bg-card rounded-2xl shadow-sm border border-slate-200 dark:border-border p-4 mb-6 flex flex-col sm:flex-row gap-3 backdrop-blur-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-foreground/40" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search resources…"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-foreground/5 border border-slate-200 dark:border-border rounded-xl text-sm font-bold text-foreground placeholder-slate-400 dark:placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2.5 bg-slate-100 dark:bg-foreground/5 border border-slate-200 dark:border-border rounded-xl text-sm font-bold text-slate-700 dark:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all appearance-none cursor-pointer"
                        >
                            <option value="All" className="bg-background">All Categories</option>
                            <option value="Lecture Halls" className="bg-background">Lecture Halls</option>
                            <option value="Labs" className="bg-background">Labs</option>
                            <option value="Rooms" className="bg-background">Rooms</option>
                            <option value="Equipment" className="bg-background">Equipment</option>
                            <option value="Vehicles" className="bg-background">Vehicles</option>
                        </select>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2.5 bg-slate-100 dark:bg-foreground/5 border border-slate-200 dark:border-border rounded-xl text-sm font-bold text-slate-700 dark:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all appearance-none cursor-pointer"
                        >
                            <option value="All" className="bg-background">All Statuses</option>
                            <option value="Available" className="bg-background">Available</option>
                            <option value="Booked" className="bg-background">Booked</option>
                            <option value="Maintenance" className="bg-background">Maintenance</option>
                        </select>
                    </div>

                    {/* ── Error Banner ── */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                            <XCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* ── Table ── */}
                    <div className="bg-card rounded-2xl shadow-sm border border-slate-200 dark:border-border overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-24">
                                <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-slate-200 dark:border-border border-t-brand-primary" />
                            </div>
                        ) : filteredResources.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                                    <Search className="w-7 h-7 text-blue-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">No resources found</h3>
                                <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-border bg-foreground/[0.02]">
                                            {(
                                                [
                                                    { label: "Name", field: "name" },
                                                    { label: "Type", field: "type" },
                                                    { label: "Capacity", field: "capacity" },
                                                    { label: "Status", field: "availability_status" },
                                                ] as { label: string; field: SortField }[]
                                            ).map(({ label, field }) => (
                                                <th
                                                    key={field}
                                                    className="px-6 py-4 text-left text-[10px] font-black text-slate-500 dark:text-foreground/40 uppercase tracking-widest cursor-pointer select-none hover:text-brand-primary transition-colors"
                                                    onClick={() => handleSort(field)}
                                                >
                                                    <span className="inline-flex items-center gap-1.5">
                                                        {label}
                                                        <SortIcon field={field} />
                                                    </span>
                                                </th>
                                            ))}
                                            {isAdmin && (
                                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 dark:text-foreground/40 uppercase tracking-widest">
                                                    Actions
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {filteredResources.map((resource) => (
                                            <tr
                                                key={resource.id}
                                                className="hover:bg-foreground/[0.02] transition-colors duration-150 group"
                                            >
                                                {/* Name */}
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-foreground">{resource.name}</span>
                                                    {resource.location && (
                                                        <p className="text-[10px] font-bold text-slate-500 dark:text-foreground/40 mt-0.5">{resource.location}</p>
                                                    )}
                                                </td>

                                                {/* Category */}
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${getCategoryColor(resource.type)}`}>
                                                        {getCategoryIcon(resource.type)}
                                                        {resource.type}
                                                    </span>
                                                </td>

                                                {/* Capacity */}
                                                <td className="px-6 py-4 text-slate-700 dark:text-foreground/80 font-bold">
                                                    {resource.capacity}
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                                                            resource.availability_status === "Available"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : resource.availability_status === "Booked"
                                                                ? "bg-red-100 text-red-600"
                                                                : "bg-amber-100 text-amber-700"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`w-1.5 h-1.5 rounded-full ${
                                                                resource.availability_status === "Available"
                                                                    ? "bg-emerald-500"
                                                                    : resource.availability_status === "Booked"
                                                                    ? "bg-red-500"
                                                                    : "bg-amber-500"
                                                            }`}
                                                        />
                                                        {resource.availability_status}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                {isAdmin && (
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => setEditingResource(resource)}
                                                                title="Edit"
                                                                className="p-2 rounded-lg text-slate-500 dark:text-foreground/40 hover:text-brand-primary hover:bg-brand-primary/5 transition-all duration-150"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(resource.id)}
                                                                title="Delete"
                                                                disabled={deletingId === resource.id}
                                                                className="p-2 rounded-lg text-slate-500 dark:text-foreground/40 hover:text-red-500 hover:bg-red-500/5 transition-all duration-150 disabled:opacity-40"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Table footer */}
                                <div className="border-t border-slate-200 dark:border-border px-6 py-3 flex items-center justify-between bg-foreground/[0.02]">
                                    <p className="text-[10px] font-bold text-slate-500 dark:text-foreground/40 uppercase tracking-widest">
                                        Showing <span className="font-black text-slate-700 dark:text-foreground/70">{filteredResources.length}</span> of{" "}
                                        <span className="font-black text-slate-700 dark:text-foreground/70">{totalResources}</span> resources
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
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
            <BulkImport
                isOpen={isBulkImportOpen}
                onClose={() => setIsBulkImportOpen(false)}
                onSuccess={fetchResources}
            />
        </ProtectedRoute>
    );
}
