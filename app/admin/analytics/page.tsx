"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer,
    LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import {
    LayoutDashboard, Users, Package, CalendarCheck, AlertCircle,
    CheckCircle2, Clock, BarChart3, TrendingUp, PieChart as PieIcon,
    AlertTriangle, ArrowLeft, RefreshCcw, FileText, ChevronDown, BellRing
} from "lucide-react";
import Link from "next/link";

// Chart.js Components
import { BookingLineChart } from "@/components/charts/BookingLineChart";
import { BookingBarChart } from "@/components/charts/BookingBarChart";
import { BookingPieChart } from "@/components/charts/BookingPieChart";

const COLORS = ['#1E3A8A', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AnalyticsDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'utilization'>('overview');
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '12m' | 'custom'>('7d');
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [department, setDepartment] = useState<string>(""); // Added for department filtering
    
    const departments = [
        "Faculty of Computing",
        "Faculty of Applied Sciences",
        "Faculty of Management",
        "Faculty of Engineering",
        "Faculty of Business",
        "Faculty of Medicine"
    ];
    
    // Overview Data
    const [overview, setOverview] = useState<any>(null);
    const [rechartsBookings, setRechartsBookings] = useState<any>(null);
    const [rechartsResources, setRechartsResources] = useState<any>(null);
    const [rechartsMaintenance, setRechartsMaintenance] = useState<any>(null);
    
    // Booking Reports Data (Chart.js)
    const [trends, setTrends] = useState<any>(null);
    const [statusDistribution, setStatusDistribution] = useState<any>(null);
    const [resourceFrequency, setResourceFrequency] = useState<any>(null);
    const [categoryFrequency, setCategoryFrequency] = useState<any>(null);

    // Utilization Reports Data
    const [utilizationData, setUtilizationData] = useState<any>(null);
    const [peakUsage, setPeakUsage] = useState<any>(null);
    
    const [loading, setLoading] = useState(true);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [exporting, setExporting] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = (user && typeof user.getIdToken === 'function') ? await user.getIdToken() : "dev-token";
            const headers = { Authorization: `Bearer ${token}` };
            const deptParam = department ? `&department=${encodeURIComponent(department)}` : "";
            const dateParams = timeRange === 'custom' && startDate && endDate 
                ? `&startDate=${startDate}&endDate=${endDate}` 
                : "";

            const [ovRes, bkRes, rsRes, mtRes] = await Promise.all([
                fetch(`http://localhost:5000/api/admin/analytics/overview?${deptParam.replace('&', '')}${dateParams}`, { headers }),
                fetch(`http://localhost:5000/api/admin/analytics/bookings?${deptParam.replace('&', '')}${dateParams}`, { headers }),
                fetch(`http://localhost:5000/api/admin/analytics/resources?${deptParam.replace('&', '')}${dateParams}`, { headers }),
                fetch(`http://localhost:5000/api/admin/analytics/maintenance?${deptParam.replace('&', '')}${dateParams}`, { headers })
            ]);

            if (!ovRes.ok || !bkRes.ok || !rsRes.ok || !mtRes.ok) throw new Error("Failed to fetch analytics data");

            const ov = await ovRes.json();
            const bk = await bkRes.json();
            const rs = await rsRes.json();
            const mt = await mtRes.json();

            setOverview(ov.data);
            setRechartsBookings(bk.data);
            setRechartsResources(rs.data);
            setRechartsMaintenance(mt.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookingReports = async (range: string) => {
        setReportsLoading(true);
        try {
            const token = (user && typeof user.getIdToken === 'function') ? await user.getIdToken() : "dev-token";
            const headers = { Authorization: `Bearer ${token}` };
            const deptParam = department ? `&department=${encodeURIComponent(department)}` : "";
            const rangeParam = range === 'custom' ? "" : `range=${range}`;
            const dateParams = range === 'custom' && startDate && endDate 
                ? `&startDate=${startDate}&endDate=${endDate}` 
                : "";

            const [trRes, stRes, rfRes, cfRes] = await Promise.all([
                fetch(`http://localhost:5000/api/admin/analytics/booking-trends?${rangeParam}${deptParam}${dateParams}`, { headers }),
                fetch(`http://localhost:5000/api/admin/analytics/booking-status?${deptParam.replace('&', '')}${dateParams}`, { headers }),
                fetch(`http://localhost:5000/api/admin/analytics/resource-bookings?${deptParam.replace('&', '')}${dateParams}`, { headers }),
                fetch(`http://localhost:5000/api/admin/analytics/category-bookings?${deptParam.replace('&', '')}${dateParams}`, { headers })
            ]);

            const tr = await trRes.json();
            const st = await stRes.json();
            const rf = await rfRes.json();
            const cf = await cfRes.json();

            setTrends(tr.data);
            setStatusDistribution(st.data);
            setResourceFrequency(rf.data);
            setCategoryFrequency(cf.data);
        } catch (err: any) {
            console.error("Booking Report Error:", err);
        } finally {
            setReportsLoading(false);
        }
    };

    const fetchUtilizationReports = async (range: string) => {
        setReportsLoading(true);
        try {
            const token = (user && typeof user.getIdToken === 'function') ? await user.getIdToken() : "dev-token";
            const headers = { Authorization: `Bearer ${token}` };
            const deptParam = department ? `&department=${encodeURIComponent(department)}` : "";
            const rangeParam = range === 'custom' ? "" : `range=${range}`;
            const dateParams = range === 'custom' && startDate && endDate 
                ? `&startDate=${startDate}&endDate=${endDate}` 
                : "";

            const [utRes, pkRes] = await Promise.all([
                fetch(`http://localhost:5000/api/admin/analytics/resource-utilization?${rangeParam}${deptParam}${dateParams}`, { headers }),
                fetch(`http://localhost:5000/api/admin/analytics/peak-usage?${deptParam.replace('&', '')}${dateParams}`, { headers })
            ]);

            const ut = await utRes.json();
            const pk = await pkRes.json();

            setUtilizationData(ut.data);
            setPeakUsage(pk.data);
        } catch (err: any) {
            console.error("Utilization Report Error:", err);
        } finally {
            setReportsLoading(false);
        }
    };

    const handleExport = async (format: 'pdf' | 'excel', type: string) => {
        setExporting(`${type}-${format}`);
        try {
            const token = (user && typeof user.getIdToken === 'function') ? await user.getIdToken() : "dev-token";
            const deptParam = department ? `&department=${encodeURIComponent(department)}` : "";
            const rangeParam = timeRange === 'custom' ? "" : `&range=${timeRange}`;
            const dateParams = timeRange === 'custom' && startDate && endDate 
                ? `&startDate=${startDate}&endDate=${endDate}` 
                : "";
                
            const response = await fetch(`http://localhost:5000/api/admin/analytics/export/${format}?type=${type}${rangeParam}${deptParam}${dateParams}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (!response.ok) throw new Error(`Export failed with status: ${response.status}`);

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `urms-${type}-report-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (err: any) {
            console.error("Export error:", err);
            setError("Export failed: " + err.message);
        } finally {
            setExporting(null);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user, department, timeRange, startDate, endDate]);

    useEffect(() => {
        if (user) {
            if (activeTab === 'bookings') fetchBookingReports(timeRange);
            if (activeTab === 'utilization') fetchUtilizationReports(timeRange);
        }
    }, [user, activeTab, timeRange, department, startDate, endDate]);

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

    const bookingStatusData = rechartsBookings ? Object.entries(rechartsBookings.statusDistribution).map(([name, value]) => ({ name, value })) : [];
    const resourceCategoryData = rechartsResources ? Object.entries(rechartsResources.categoryDistribution).map(([name, value]) => ({ name, value })) : [];

    // Chart.js Data Mappings
    const chartJsTrends = {
        labels: (trends as any)?.map((t: any) => t.label) || [],
        datasets: [{
            label: 'Bookings',
            data: (trends as any)?.map((t: any) => t.value) || [],
            borderColor: '#1E3A8A',
            backgroundColor: 'rgba(30, 58, 138, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#1E3A8A',
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };

    const chartJsStatus = {
        labels: statusDistribution ? Object.keys(statusDistribution as any) : [],
        datasets: [{
            data: statusDistribution ? Object.values(statusDistribution as any) : [],
            backgroundColor: COLORS,
            borderWidth: 0,
            hoverOffset: 15
        }]
    };

    const chartJsPeakHours = {
        labels: (peakUsage as any)?.peakHours?.map((h: any) => h.label) || [],
        datasets: [{
            label: 'Bookings',
            data: (peakUsage as any)?.peakHours?.map((h: any) => h.count) || [],
            backgroundColor: '#F59E0B',
            borderRadius: 6,
        }]
    };

    const chartJsPeakDays = {
        labels: (peakUsage as any)?.peakDays?.map((d: any) => d.label) || [],
        datasets: [{
            label: 'Bookings',
            data: (peakUsage as any)?.peakDays?.map((d: any) => d.count) || [],
            backgroundColor: '#10B981',
            borderRadius: 6,
        }]
    };

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
                                    Analytics & Reports <BarChart3 className="w-8 h-8 text-indigo-500" />
                                </h1>
                                <p className="text-slate-500 font-medium">Real-time system insights & utilization trends</p>
                            </div>
                        </div>
                        
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
                                    <button 
                                        onClick={() => setActiveTab('overview')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'overview' ? 'bg-[#1E3A8A] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        Overview
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('bookings')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'bookings' ? 'bg-[#1E3A8A] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        Booking Stats
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('utilization')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'utilization' ? 'bg-[#1E3A8A] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        Resource Utilization
                                    </button>
                                </div>

                                {timeRange === 'custom' && (
                                    <div className="flex items-center gap-2 bg-white p-1 px-3 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-2 duration-300">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">From</span>
                                            <input 
                                                type="date" 
                                                value={startDate} 
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 p-0 w-28"
                                            />
                                        </div>
                                        <div className="w-px h-4 bg-slate-200 mx-1" />
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">To</span>
                                            <input 
                                                type="date" 
                                                value={endDate} 
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 p-0 w-28"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <div className="relative group">
                                        <select
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                            className="appearance-none pl-4 pr-10 py-2.5 bg-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                                        >
                                            <option value="">All Departments</option>
                                            {departments.map((dept) => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>

                                    <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

                                    <button
                                        onClick={() => handleExport('pdf', activeTab)}
                                        disabled={!!exporting}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
                                    >
                                        <FileText className="w-4 h-4 text-red-500" />
                                        {exporting === `${activeTab}-pdf` ? 'Generating...' : 'PDF'}
                                    </button>
                                        {exporting === `${activeTab}-excel` ? 'Preparing...' : 'Excel'}
                                    </button>
                                    <Link
                                        href="/admin/analytics/reports"
                                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl border border-slate-900 hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
                                    >
                                        <BellRing className="w-4 h-4" />
                                        Schedule Reports
                                    </Link>
                                </div>
                            </div>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-100 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            <p className="font-bold">{error}</p>
                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <>
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
                                {/* Booking Trends (Recharts) */}
                                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-blue-500" /> Recent Activity
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                                                {timeRange === 'custom' ? 'Custom Range' : `Last ${timeRange === '7d' ? '7 Days' : timeRange === '30d' ? '30 Days' : '12 Months'}`}
                                            </span>
                                            <TimeRangePicker value={timeRange} onChange={setTimeRange} mini />
                                        </div>
                                    </div>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={rechartsBookings?.trends}>
                                                <defs>
                                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                                                <RechartsTooltip 
                                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                                                    itemStyle={{fontWeight: 'bold', color: '#1E3A8A'}}
                                                />
                                                <Area type="monotone" dataKey="count" stroke="#1E3A8A" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Booking Status */}
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                    <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                                        <PieIcon className="w-5 h-5 text-emerald-500" /> Status Mix
                                    </h3>
                                    <div className="h-[250px] w-full relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsPieChart>
                                                <Pie
                                                    data={bookingStatusData}
                                                    cx="50%" cy="50%"
                                                    innerRadius={60} outerRadius={80}
                                                    paddingAngle={5} dataKey="value"
                                                >
                                                    {bookingStatusData.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip />
                                            </RechartsPieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-3xl font-black text-slate-900">{(overview?.completedBookings || 0) + (overview?.activeBookings || 0)}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        {bookingStatusData.slice(0, 4).map((item, i) => (
                                            <div key={item.name} className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                                                <span className="text-[10px] font-bold text-slate-600 truncate">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Maintenance Summary */}
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-red-500" /> Maintenance
                                    </h3>
                                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100 mb-6 text-center">
                                        <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Avg. Resolution</p>
                                        <p className="text-4xl font-black text-red-900">{rechartsMaintenance?.avgCompletionTimeHours}h</p>
                                    </div>
                                    <div className="space-y-4">
                                        {rechartsMaintenance?.topMaintainedResources.slice(0, 3).map((res: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <p className="text-xs font-bold text-slate-700 truncate mr-2">{res.name}</p>
                                                <span className="text-[10px] font-black bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-500 whitespace-nowrap">{res.count} Issues</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                            <LayoutDashboard className="w-5 h-5 text-purple-500" /> Asset Distribution
                                        </h3>
                                        <TimeRangePicker value={timeRange} onChange={setTimeRange} mini />
                                    </div>
                                    <div className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={resourceCategoryData} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fill: '#64748B', fontWeight: 'bold', fontSize: 10}} />
                                                <RechartsTooltip />
                                                <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <CalendarCheck className="w-5 h-5 text-indigo-500" /> Booking Statistics
                                </h3>
                                <TimeRangePicker value={timeRange} onChange={setTimeRange} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <ChartCard title="Activity Trends" icon={<TrendingUp className="text-blue-500" />} loading={reportsLoading}>
                                    <BookingLineChart data={chartJsTrends} />
                                </ChartCard>
                                <ChartCard title="Workflow Distribution" icon={<PieIcon className="text-emerald-500" />} loading={reportsLoading}>
                                    <BookingPieChart data={chartJsStatus} />
                                </ChartCard>
                                <ChartCard title="Top Resources" icon={<Package className="text-purple-500" />} loading={reportsLoading}>
                                    <BookingBarChart data={{
                                        labels: (resourceFrequency as any)?.map((r: any) => r.name) || [],
                                        datasets: [{
                                            label: 'Bookings',
                                            data: (resourceFrequency as any)?.map((r: any) => r.count) || [],
                                            backgroundColor: '#8B5CF6',
                                            borderRadius: 8
                                        }]
                                    }} horizontal />
                                </ChartCard>
                                <ChartCard title="Category Usage" icon={<LayoutDashboard className="text-indigo-500" />} loading={reportsLoading}>
                                    <BookingBarChart data={{
                                        labels: categoryFrequency ? Object.keys(categoryFrequency as any) : [],
                                        datasets: [{
                                            label: 'Bookings',
                                            data: categoryFrequency ? Object.values(categoryFrequency as any) : [],
                                            backgroundColor: '#10B981',
                                            borderRadius: 8
                                        }]
                                    }} />
                                </ChartCard>
                            </div>
                        </div>
                    )}

                    {activeTab === 'utilization' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-indigo-500" /> Peak Usage & Efficiency
                                </h3>
                                <TimeRangePicker value={timeRange} onChange={setTimeRange} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <ChartCard title="Peak Booking Hours" icon={<Clock className="text-amber-500" />} loading={reportsLoading}>
                                    <BookingBarChart data={chartJsPeakHours} />
                                </ChartCard>
                                <ChartCard title="Busiest Days" icon={<CalendarCheck className="text-emerald-500" />} loading={reportsLoading}>
                                    <BookingBarChart data={chartJsPeakDays} />
                                </ChartCard>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-indigo-500" /> Detailed Resource Utilization
                                </h3>
                                
                                {reportsLoading ? (
                                    <div className="h-64 flex items-center justify-center"><div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin" /></div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-100">
                                                    <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest">Resource</th>
                                                    <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                                                    <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest">Total Bookings</th>
                                                    <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest">Total Hours</th>
                                                    <th className="pb-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Utilization %</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {utilizationData?.map((res: any) => (
                                                    <tr key={res.id} className="group hover:bg-slate-50 transition-colors">
                                                        <td className="py-4 font-bold text-slate-700">{res.name}</td>
                                                        <td className="py-4 text-sm text-slate-500">
                                                            <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500">{res.type}</span>
                                                        </td>
                                                        <td className="py-4 font-black text-indigo-600">{res.totalBookings}</td>
                                                        <td className="py-4 text-sm font-bold text-slate-600">{res.totalHours}h</td>
                                                        <td className="py-4 text-right">
                                                            <div className="flex items-center justify-end gap-3">
                                                                <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                                                                    <div 
                                                                        className={`h-full rounded-full ${res.utilizationRate > 70 ? 'bg-red-500' : res.utilizationRate > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                                        style={{ width: `${res.utilizationRate}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-sm font-black text-slate-900">{res.utilizationRate}%</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

function TimeRangePicker({ value, onChange, mini }: { value: string, onChange: (v: any) => void, mini?: boolean }) {
    const options = [
        { label: '7D', full: '7 Days', value: '7d' },
        { label: '30D', full: '30 Days', value: '30d' },
        { label: '12M', full: '12 Months', value: '12m' },
        { label: 'Custom', full: 'Custom Range', value: 'custom' }
    ];

    return (
        <div className="flex items-center gap-1 sm:gap-2">
            {options.map((opt) => (
                <button 
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-black transition-all border ${value === opt.value ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                >
                    {mini ? opt.label : opt.full}
                </button>
            ))}
        </div>
    );
}

function ChartCard({ title, icon, loading, children }: { title: string, icon: React.ReactNode, loading: boolean, children: React.ReactNode }) {
    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                {icon} {title}
            </h3>
            {loading ? (
                <div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin" /></div>
            ) : (
                <div className="flex-1">{children}</div>
            )}
        </div>
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
