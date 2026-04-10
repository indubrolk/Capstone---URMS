import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface AddResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddResourceModal({ isOpen, onClose, onSuccess }: AddResourceModalProps) {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        category: 'Lecture Halls',
        capacity: '',
        location: '',
        status: 'Available'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = user ? await user.getIdToken() : 'dev-token';

            const response = await fetch('http://localhost:5000/api/resources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create resource');
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add Resource</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-semibold border border-red-100 flex items-center gap-3">
                            <X className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <form id="add-resource-form" onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Resource Name</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="E.g., Z9 Hall"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-medium text-slate-900"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-medium text-slate-900 appearance-none"
                                >
                                    <option value="Lecture Halls">Lecture Halls</option>
                                    <option value="Labs">Labs</option>
                                    <option value="Equipment">Equipment</option>
                                    <option value="Vehicles">Vehicles</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Capacity</label>
                                <input
                                    required
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    placeholder="E.g., 50 seats"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-medium text-slate-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                            <input
                                required
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="E.g., Block A"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-medium text-slate-900"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-medium text-slate-900 appearance-none"
                            >
                                <option value="Available">Available</option>
                                <option value="Booked">Booked</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>
                    </form>
                </div>

                <div className="p-8 pb-8 pt-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3 mt-auto">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 rounded-full text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="add-resource-form"
                        disabled={loading}
                        className="px-8 py-3 rounded-full bg-brand-primary text-white font-bold tracking-wide hover:bg-brand-primary-light active:scale-95 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Check className="w-5 h-5" />
                                Save Resource
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
