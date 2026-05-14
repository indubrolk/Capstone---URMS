"use client";

import React, { useState, useEffect } from "react";
import {
    X,
    Check,
    Loader2,
    Calendar,
    Clock,
    MapPin,
    Search,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

interface NewBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface Resource {
    id: string;
    name: string;
    type: string;
    location: string;
    capacity: string;
    availability_status: string;
}

const formatConflictDate = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const formatConflictTime = (value: string) =>
    new Date(value).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

const normalizeStatusLabel = (status: string) => {
    if (status === "Approved") return "Confirmed";
    if (status === "Pending") return "Pending";
    if (status === "Cancelled") return "Cancelled";
    if (status === "Completed") return "Completed";
    return status;
};

export default function NewBookingModal({
    isOpen,
    onClose,
    onSuccess,
}: NewBookingModalProps) {
    const { user } = useAuth();

    const [resources, setResources] = useState<Resource[]>([]);
    const [loadingResources, setLoadingResources] = useState(false);
    const [resourceSearch, setResourceSearch] = useState("");
    const [selectedResource, setSelectedResource] = useState<Resource | null>(
        null
    );
    const [showResourceDropdown, setShowResourceDropdown] = useState(false);

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [purpose, setPurpose] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch resources
    useEffect(() => {
        if (!isOpen) return;
        fetchResources();
    }, [isOpen]);

    const fetchResources = async () => {
        setLoadingResources(true);
        try {
            const { data, error } = await supabase
                .from("resources")
                .select("*")
                .order("name");
            if (error) throw error;
            setResources(data || []);
        } catch (err) {
            console.error("Error fetching resources:", err);
        } finally {
            setLoadingResources(false);
        }
    };

    const filteredResources = resources.filter(
        (r) =>
            r.name.toLowerCase().includes(resourceSearch.toLowerCase()) ||
            r.location.toLowerCase().includes(resourceSearch.toLowerCase()) ||
            r.type.toLowerCase().includes(resourceSearch.toLowerCase())
    );

    const handleSelectResource = (resource: Resource) => {
        setSelectedResource(resource);
        setResourceSearch(resource.name);
        setShowResourceDropdown(false);
    };

    const resetForm = () => {
        setSelectedResource(null);
        setResourceSearch("");
        setDate("");
        setStartTime("");
        setEndTime("");
        setPurpose("");
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!selectedResource) {
            setError("Please select a resource to book.");
            return;
        }
        if (!date || !startTime || !endTime) {
            setError("Please fill in date and time fields.");
            return;
        }

        const startDateTime = new Date(`${date}T${startTime}`);
        const endDateTime = new Date(`${date}T${endTime}`);
        const startIso = startDateTime.toISOString();
        const endIso = endDateTime.toISOString();

        if (endDateTime <= startDateTime) {
            setError("End time must be after start time.");
            return;
        }

        // Check if booking is in the past
        if (startDateTime < new Date()) {
            setError("Cannot book a time slot in the past.");
            return;
        }

        setLoading(true);
        try {
            const { data: conflicts, error: conflictError } = await supabase
                .from("bookings")
                .select("id, start_time, end_time, status")
                .eq("resource_id", selectedResource.id)
                .neq("status", "Cancelled")
                .lt("start_time", endIso)
                .gt("end_time", startIso)
                .limit(1);

            if (conflictError) {
                throw new Error(
                    conflictError.message || "Failed to check availability"
                );
            }

            if (conflicts && conflicts.length > 0) {
                const conflict = conflicts[0] as {
                    start_time?: string;
                    end_time?: string;
                    status?: string;
                };
                if (conflict?.start_time && conflict?.end_time) {
                    const dateLabel = formatConflictDate(conflict.start_time);
                    const timeLabel = `${formatConflictTime(
                        conflict.start_time
                    )} - ${formatConflictTime(conflict.end_time)}`;
                    const statusLabel = conflict.status
                        ? normalizeStatusLabel(conflict.status)
                        : "Scheduled";
                    setError(
                        `This resource is already booked (${statusLabel}) on ${dateLabel} at ${timeLabel}.`
                    );
                } else {
                    setError(
                        "This resource is already booked for the selected time."
                    );
                }
                return;
            }

            const { error: insertError } = await supabase
                .from("bookings")
                .insert({
                    resource_id: selectedResource.id,
                    user_id: user?.uid || null,
                    start_time: startIso,
                    end_time: endIso,
                    status: "Pending",
                });

            if (insertError) {
                throw new Error(
                    insertError.message || "Failed to create booking"
                );
            }

            resetForm();
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to create booking.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Get today's date in YYYY-MM-DD for min attribute
    const today = new Date().toISOString().split("T")[0];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-[#1E3A8A]">
                            New Booking
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Reserve a facility or resource for your session
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-7 py-6">
                    {error && (
                        <div className="mb-5 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                            <X className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form
                        id="new-booking-form"
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Resource Selection */}
                        <div className="relative">
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                Resource / Facility{" "}
                                <span className="text-red-400">*</span>
                            </label>
                            <div className="relative group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#1E3A8A]" />
                                <input
                                    type="text"
                                    value={resourceSearch}
                                    onChange={(e) => {
                                        setResourceSearch(e.target.value);
                                        setShowResourceDropdown(true);
                                        if (
                                            selectedResource &&
                                            e.target.value !==
                                            selectedResource.name
                                        ) {
                                            setSelectedResource(null);
                                        }
                                    }}
                                    onFocus={() =>
                                        setShowResourceDropdown(true)
                                    }
                                    placeholder="Search for a resource..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>

                            {/* Resource Dropdown */}
                            {showResourceDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                                    {loadingResources ? (
                                        <div className="px-4 py-6 text-center text-slate-400 text-sm">
                                            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                                            Loading resources...
                                        </div>
                                    ) : filteredResources.length === 0 ? (
                                        <div className="px-4 py-4 text-center text-slate-400 text-sm">
                                            No resources found
                                        </div>
                                    ) : (
                                        filteredResources.map((resource) => (
                                            <button
                                                key={resource.id}
                                                type="button"
                                                onClick={() =>
                                                    handleSelectResource(
                                                        resource
                                                    )
                                                }
                                                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${selectedResource?.id ===
                                                    resource.id
                                                    ? "bg-blue-50"
                                                    : ""
                                                    }`}
                                            >
                                                <div className="w-9 h-9 rounded-xl bg-[#1E3A8A]/5 flex items-center justify-center shrink-0">
                                                    <MapPin className="w-4 h-4 text-[#1E3A8A]" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 truncate">
                                                        {resource.name}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 font-medium">
                                                        {resource.type} •{" "}
                                                        {resource.location} •
                                                        Cap:{" "}
                                                        {resource.capacity} •
                                                        Status: {resource.availability_status}
                                                    </p>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Selected Resource Preview */}
                            {selectedResource && (
                                <div className="mt-2 p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#1E3A8A]/10 flex items-center justify-center shrink-0">
                                        <MapPin className="w-4 h-4 text-[#1E3A8A]" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-slate-800">
                                            {selectedResource.name}
                                        </p>
                                        <p className="text-[11px] text-slate-500 font-medium">
                                            {selectedResource.type} •{" "}
                                            {selectedResource.location} • Status: {selectedResource.availability_status}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedResource(null);
                                            setResourceSearch("");
                                        }}
                                        className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5 text-slate-400" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Date{" "}
                                    <span className="text-red-400">*</span>
                                </span>
                            </label>
                            <input
                                required
                                type="date"
                                value={date}
                                min={today}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* Time Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        Start Time{" "}
                                        <span className="text-red-400">*</span>
                                    </span>
                                </label>
                                <input
                                    required
                                    type="time"
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        End Time{" "}
                                        <span className="text-red-400">*</span>
                                    </span>
                                </label>
                                <input
                                    required
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Purpose / Notes */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                                Purpose / Notes
                            </label>
                            <textarea
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                rows={3}
                                placeholder="e.g. Final Year Research Project meeting, Lab practical session..."
                                className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                            />
                        </div>

                        {/* Quick Time Slots */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                                Quick Select
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    {
                                        label: "Morning (08:00–12:00)",
                                        start: "08:00",
                                        end: "12:00",
                                    },
                                    {
                                        label: "Afternoon (13:00–17:00)",
                                        start: "13:00",
                                        end: "17:00",
                                    },
                                    {
                                        label: "Full Day (08:00–17:00)",
                                        start: "08:00",
                                        end: "17:00",
                                    },
                                    {
                                        label: "1 Hour (09:00–10:00)",
                                        start: "09:00",
                                        end: "10:00",
                                    },
                                    {
                                        label: "2 Hours (10:00–12:00)",
                                        start: "10:00",
                                        end: "12:00",
                                    },
                                ].map((slot) => (
                                    <button
                                        key={slot.label}
                                        type="button"
                                        onClick={() => {
                                            setStartTime(slot.start);
                                            setEndTime(slot.end);
                                        }}
                                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 ${startTime === slot.start &&
                                            endTime === slot.end
                                            ? "bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm"
                                            : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-400 hover:text-[#1E3A8A]"
                                            }`}
                                    >
                                        {slot.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-7 py-5 border-t border-slate-100 bg-slate-50/60 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="new-booking-form"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#1e40af] text-white text-sm font-semibold flex items-center gap-2 transition-colors shadow-md shadow-blue-900/20 disabled:opacity-60 active:scale-95"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />{" "}
                                Booking…
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" /> Confirm Booking
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
