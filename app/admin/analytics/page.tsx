"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import {
    LayoutDashboard, Users, Package, CalendarCheck, AlertCircle,
    CheckCircle2, Clock, BarChart3, TrendingUp, PieChart as PieIcon,
    AlertTriangle, ArrowLeft, RefreshCcw
} from "lucide-react";
import Link from "next/link";

const COLORS = ['#1E3A8A', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AnalyticsDashboard() {
    const { user } = useAuth();
    const [overview, setOverview] = useState<any>(null);
    const [bookings, setBookings] = useState<any>(null);
    const [resources, setResources] = useState<any>(null);
    const [maintenance, setMaintenance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Support both Firebase User and potential mock/direct auth
            const token = (user && typeof user.getIdToken === 'function') ? await user.getIdToken() : "dev-token";
            const headers = { Authorization: `Bearer ${token}` };

            const [ovRes, bkRes, rsRes, mtRes] = await Promise.all([
                fetch("http://localhost:5000/api/admin/analytics/overview", { headers }),
                fetch("http://localhost:5000/api/admin/analytics/bookings", { headers }),
                fetch("http://localhost:5000/api/admin/analytics/resources", { headers }),
                fetch("http://localhost:5000/api/admin/analytics/maintenance", { headers })
            ]);

            if (!ovRes.ok || !bkRes.ok || !rsRes.ok || !mtRes.ok) throw new Error("Failed to fetch analytics data");

            const ov = await ovRes.json();
            const bk = await bkRes.json();
            const rs = await rsRes.json();
            const mt = await mtRes.json();

            setOverview(ov.data);
            setBookings(bk.data);
            setResources(rs.data);
            setMaintenance(mt.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F0F4FF]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-[4px] border-slate-200 border-t-[#1E3A8A]" />
                    <p className="text-slate-500 font-bold animate-pulse">Gathering Insights...</p>
                </div>
            </div>
        );
    }

    const bookingStatusData = bookings ? Object.entries(bookings.statusDistribution).map(([name, value]) => ({ name, value })) : [];
    const resourceCategoryData = resources ? Object.entries(resources.categoryDistribution).map(([name, value]) => ({ name, value })) : [];
    const maintenanceStatusData = maintenance ? Object.entries(maintenance.statusDistribution).map(([name, value]) => ({ name, value })) : [];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#F0F4FF] pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-black text-[#1E3A8A] tracking-tight flex items-center gap-2">
                                    Usage Analytics <TrendingUp className="w-8 h-8 text-indigo-500" />
                                </h1>
                                <p className="text-slate-500 font-medium">Real-time system insights & trends</p>
                            </div>
                        </div>
                        <button 
                            onClick={fetchData}
                            className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 active:scale-95 transition-all"
                        >
                            <RefreshCcw className="w-4 h-4" /> Refresh Data
                        </button>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-100 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard 
                            title="Total Resources" 
                            value={overview?.totalResources} 
                            icon={<Package className="w-6 h-6" />} 
                            color="bg-blue-500" 
                        />
                        <StatCard 
                            title="Active Bookings" 
                            value={overview?.activeBookings} 
                            icon={<CalendarCheck className="w-6 h-6" />} 
                            color="bg-emerald-500" 
                        />
                        <StatCard 
                            title="Pending Maintenance" 
                            value={overview?.pendingMaintenanceTasks} 
                            icon={<AlertCircle className="w-6 h-6" />} 
                            color="bg-amber-500" 
                        />
                        <StatCard 
                            title="Utilization Rate" 
                            value={`${overview?.resourceUtilization}%`} 
                            icon={<TrendingUp className="w-6 h-6" />} 
                            color="bg-indigo-500" 
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Booking Trends */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-blue-500" /> Booking Trends
                                </h3>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Last 7 Days</span>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={bookings?.trends}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                                            itemStyle={{fontWeight: 'bold', color: '#1E3A8A'}}
                                        />
                                        <Area type="monotone" dataKey="count" stroke="#1E3A8A" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Booking Status Distribution */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                                <PieIcon className="w-5 h-5 text-emerald-500" /> Booking Status
                            </h3>
                            <div className="h-[250px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={bookingStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {bookingStatusData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-black text-slate-900">{overview?.completedBookings + overview?.activeBookings}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Total Bookings</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                {bookingStatusData.map((item, i) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                                        <span className="text-xs font-bold text-slate-600">{item.name}: {String(item.value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Resources */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                                <Package className="w-5 h-5 text-indigo-500" /> Most Popular
                            </h3>
                            <div className="space-y-6">
                                {resources?.topResources.map((res: any, i: number) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="flex justify-between items-end mb-2">
                                            <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{res.name}</p>
                                            <p className="text-xs font-black text-indigo-500">{res.count} Bookings</p>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div 
                                                className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                                                style={{width: `${(res.count / Math.max(...resources.topResources.map((r:any)=>r.count), 1)) * 100}%`}}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {resources?.topResources.length === 0 && (
                                    <div className="text-center py-10 text-slate-400 font-medium">No booking data yet</div>
                                )}
                            </div>
                        </div>

                        {/* Resource Categories */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-purple-500" /> Categories
                            </h3>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={resourceCategoryData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fill: '#64748B', fontWeight: 'bold', fontSize: 10}} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Maintenance Insights */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" /> Maintenance
                            </h3>
                            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 mb-6">
                                <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Avg. Completion Time</p>
                                <p className="text-3xl font-black text-red-900">{maintenance?.avgCompletionTimeHours} Hours</p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Frequently Maintained</p>
                                {maintenance?.topMaintainedResources.map((res: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-bold text-slate-700">{res.name}</p>
                                        <span className="text-[10px] font-black bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-500">{res.count} Issues</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

function StatCard({ title, value, icon, color }: { title: string, value: any, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`} />
            <div className="flex items-center gap-4">
                <div className={`${color} p-4 rounded-2xl text-white shadow-lg shadow-current/20`}>
                    {icon}
                </div>
                <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                    <p className="text-3xl font-black text-slate-900">{value ?? "—"}</p>
                </div>
            </div>
        </div>
    );
}
