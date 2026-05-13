"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { 
    BellRing, Calendar, Clock, Mail, FileText, Plus, Trash2, 
    CheckCircle2, XCircle, ChevronLeft, Save, AlertCircle,
    FileSpreadsheet, Settings2
} from "lucide-react";
import Link from "next/link";

interface ReportSchedule {
    id: string;
    report_types: string[];
    recipients: string[];
    delivery_day: number;
    delivery_time: string;
    format: 'pdf' | 'excel';
    is_enabled: boolean;
    last_run_at: string | null;
}

export default function ReportSchedulingPage() {
    const { user } = useAuth();
    const [schedules, setSchedules] = useState<ReportSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<ReportSchedule | null>(null);
    const [error, setError] = useState<string | null>(null);

    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const REPORT_TYPES = [
        { id: 'overview', label: 'System Overview', icon: <Settings2 className="w-4 h-4" /> },
        { id: 'booking', label: 'Booking Statistics', icon: <FileText className="w-4 h-4" /> },
        { id: 'utilization', label: 'Resource Utilization', icon: <FileSpreadsheet className="w-4 h-4" /> },
        { id: 'maintenance', label: 'Maintenance Reports', icon: <AlertCircle className="w-4 h-4" /> }
    ];

    useEffect(() => {
        if (user) {
            fetchSchedules();
        }
    }, [user]);

    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const token = (user && typeof user.getIdToken === 'function') ? await user.getIdToken() : "dev-token";
            const res = await fetch(`${API}/api/admin/reports/schedules`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === "success") {
                setSchedules(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch schedules", err);
            setError("Failed to load schedules");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleEnabled = async (schedule: ReportSchedule) => {
        try {
            const token = (user && typeof user.getIdToken === 'function') ? await user.getIdToken() : "dev-token";
            const res = await fetch(`${API}/api/admin/reports/schedules/${schedule.id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ is_enabled: !schedule.is_enabled })
            });
            if (res.ok) {
                fetchSchedules();
            }
        } catch (err) {
            console.error("Toggle failed", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this schedule?")) return;
        try {
            const token = (user && typeof user.getIdToken === 'function') ? await user.getIdToken() : "dev-token";
            const res = await fetch(`${API}/api/admin/reports/schedules/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                fetchSchedules();
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <div className="min-h-screen bg-[#F8FAFC] pb-20">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/analytics" className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200">
                                <ChevronLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Report Scheduling</h1>
                                <p className="text-slate-500 text-sm font-medium">Automated weekly performance reports</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                setEditingSchedule(null);
                                setShowModal(true);
                            }}
                            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-slate-200"
                        >
                            <Plus className="w-4 h-4" /> Create Schedule
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 mt-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-500 font-bold">Syncing schedules...</p>
                        </div>
                    ) : schedules.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-200 shadow-sm">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <BellRing className="w-10 h-10 text-slate-300" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">No Active Schedules</h2>
                            <p className="text-slate-500 max-w-sm mx-auto mb-10">Configure automated reports to be delivered to your inbox every week.</p>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                            >
                                Setup Your First Schedule
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {schedules.map((s) => (
                                <div key={s.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                    {/* Decorative gradient */}
                                    <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-5 transition-all ${s.is_enabled ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                                    
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`p-3 rounded-2xl ${s.is_enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                            <BellRing className="w-6 h-6" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleToggleEnabled(s)}
                                                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${s.is_enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                                            >
                                                {s.is_enabled ? 'Active' : 'Disabled'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Reports Included</p>
                                            <div className="flex flex-wrap gap-2">
                                                {s.report_types.map(t => (
                                                    <span key={t} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600 capitalize">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivery Day</p>
                                                <div className="flex items-center gap-1.5 text-slate-700 font-bold text-sm">
                                                    <Calendar className="w-3.5 h-3.5 text-blue-500" /> {DAYS[s.delivery_day]}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Timing</p>
                                                <div className="flex items-center gap-1.5 text-slate-700 font-bold text-sm">
                                                    <Clock className="w-3.5 h-3.5 text-amber-500" /> {s.delivery_time.substring(0, 5)}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Format & Recipients</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-slate-700 font-bold text-sm">
                                                    {s.format === 'pdf' ? <FileText className="w-3.5 h-3.5 text-red-500" /> : <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />}
                                                    <span className="uppercase">{s.format}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold bg-slate-50 px-2 py-0.5 rounded-full">
                                                    <Mail className="w-3 h-3" /> {s.recipients.length} Recipients
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                                        <button 
                                            onClick={() => {
                                                setEditingSchedule(s);
                                                setShowModal(true);
                                            }}
                                            className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs py-2.5 rounded-xl transition-all border border-slate-100"
                                        >
                                            Edit Configuration
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(s.id)}
                                            className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    {s.last_run_at && (
                                        <div className="mt-4 text-center">
                                            <p className="text-[9px] font-bold text-slate-400 italic">Last generated: {new Date(s.last_run_at).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {showModal && (
                    <ScheduleModal 
                        schedule={editingSchedule} 
                        onClose={() => setShowModal(false)} 
                        onSuccess={() => {
                            setShowModal(false);
                            fetchSchedules();
                        }}
                        reportTypes={REPORT_TYPES}
                        days={DAYS}
                        userToken={user && typeof user.getIdToken === 'function' ? user.getIdToken() : Promise.resolve("dev-token")}
                    />
                )}
            </div>
        </ProtectedRoute>
    );
}

function ScheduleModal({ schedule, onClose, onSuccess, reportTypes, days, userToken }: any) {
    const [formData, setFormData] = useState({
        report_types: schedule?.report_types || [],
        recipients: schedule?.recipients?.join(', ') || '',
        delivery_day: schedule?.delivery_day ?? 1,
        delivery_time: schedule?.delivery_time ? schedule.delivery_time.substring(0, 5) : '09:00',
        format: schedule?.format || 'pdf',
        is_enabled: schedule?.is_enabled ?? true
    });
    const [saving, setSaving] = useState(false);

    const toggleReportType = (id: string) => {
        setFormData(prev => ({
            ...prev,
            report_types: prev.report_types.includes(id)
                ? prev.report_types.filter((t: string) => t !== id)
                : [...prev.report_types, id]
        }));
    };

    const handleSave = async () => {
        if (formData.report_types.length === 0) return alert("Select at least one report type");
        if (!formData.recipients) return alert("Add at least one recipient");

        setSaving(true);
        try {
            const token = await userToken;
            const payload = {
                ...formData,
                recipients: formData.recipients.split(',').map((r: string) => r.trim()).filter((r: string) => r),
                delivery_time: `${formData.delivery_time}:00`
            };

            const url = schedule 
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/reports/schedules/${schedule.id}`
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/reports/schedules`;
            
            const method = schedule ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSuccess();
            } else {
                alert("Failed to save schedule");
            }
        } catch (err) {
            console.error("Save error", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
                <div className="p-8 sm:p-10">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">{schedule ? 'Edit Schedule' : 'New Report Schedule'}</h2>
                            <p className="text-slate-500 font-medium text-sm">Configure your automated reporting cycle</p>
                        </div>
                        <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Report Types */}
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Select Report Modules</label>
                            <div className="grid grid-cols-2 gap-3">
                                {reportTypes.map((type: any) => (
                                    <button 
                                        key={type.id}
                                        onClick={() => toggleReportType(type.id)}
                                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                                            formData.report_types.includes(type.id)
                                            ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                                            : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-xl ${formData.report_types.includes(type.id) ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                                            {type.icon}
                                        </div>
                                        <span className="font-bold text-sm">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Settings */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Delivery Day</label>
                                <div className="relative">
                                    <select 
                                        value={formData.delivery_day}
                                        onChange={(e) => setFormData({...formData, delivery_day: parseInt(e.target.value)})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                                    >
                                        {days.map((day: string, idx: number) => (
                                            <option key={idx} value={idx}>{day}</option>
                                        ))}
                                    </select>
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Time (24h)</label>
                                <div className="relative">
                                    <input 
                                        type="time"
                                        value={formData.delivery_time}
                                        onChange={(e) => setFormData({...formData, delivery_time: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                                    />
                                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Recipients */}
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Recipients (Emails or User IDs)</label>
                            <div className="relative">
                                <textarea 
                                    placeholder="admin@demo.lk, manager@demo.lk"
                                    value={formData.recipients}
                                    onChange={(e) => setFormData({...formData, recipients: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-3.5 font-bold text-slate-700 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                                />
                                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium italic">Separate multiple recipients with commas.</p>
                        </div>

                        {/* Format */}
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Report Format</label>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setFormData({...formData, format: 'pdf'})}
                                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-black transition-all ${
                                        formData.format === 'pdf' ? 'border-red-500 bg-red-50 text-red-600 shadow-md shadow-red-50' : 'border-slate-100 text-slate-400'
                                    }`}
                                >
                                    <FileText className="w-5 h-5" /> PDF
                                </button>
                                <button 
                                    onClick={() => setFormData({...formData, format: 'excel'})}
                                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 font-black transition-all ${
                                        formData.format === 'excel' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-md shadow-emerald-50' : 'border-slate-100 text-slate-400'
                                    }`}
                                >
                                    <FileSpreadsheet className="w-5 h-5" /> EXCEL
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex gap-4">
                        <button 
                            onClick={onClose}
                            className="flex-1 px-8 py-4 bg-slate-50 text-slate-500 font-bold rounded-2xl hover:bg-slate-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-[2] px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
                            {schedule ? 'Update Schedule' : 'Activate Schedule'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
