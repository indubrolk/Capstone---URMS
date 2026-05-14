"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, MapPin, BookOpen } from "lucide-react";

interface NewBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function NewBookingModal({ isOpen, onClose, onSuccess }: NewBookingModalProps) {
    const [formData, setFormData] = useState({
        resource: "",
        faculty: "",
        date: "",
        startTime: "",
        endTime: "",
        purpose: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // TODO: Submit booking to Supabase
            console.log("Submitting booking:", formData);
            await new Promise((res) => setTimeout(res, 600));
            onSuccess();
            onClose();
            setFormData({ resource: "", faculty: "", date: "", startTime: "", endTime: "", purpose: "" });
        } catch (err) {
            console.error("Booking failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">New Booking</h2>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">Reserve a facility or resource</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Resource */}
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                            Resource / Facility
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                name="resource"
                                value={formData.resource}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Advanced Robotics Lab"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                            />
                        </div>
                    </div>

                    {/* Faculty */}
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                            Faculty
                        </label>
                        <div className="relative">
                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                name="faculty"
                                value={formData.faculty}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all appearance-none"
                            >
                                <option value="">Select Faculty</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Science">Science</option>
                                <option value="Business">Business</option>
                                <option value="Medicine">Medicine</option>
                                <option value="Arts">Arts</option>
                                <option value="Computing">Computing</option>
                            </select>
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                            Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                            />
                        </div>
                    </div>

                    {/* Time Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                                Start Time
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                                End Time
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Purpose */}
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                            Purpose (Optional)
                        </label>
                        <textarea
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Brief description of the booking purpose..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-brand-secondary transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Booking..." : "Confirm Booking"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
