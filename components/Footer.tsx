import React from "react";
import { Landmark, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8 mt-auto border-t border-slate-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand */}
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 text-white font-bold text-2xl mb-4 tracking-tight">
                        <div className="bg-brand-primary text-white p-1 rounded-lg">
                            <Landmark className="w-6 h-6" />
                        </div>
                        <span>UniLink</span>
                    </div>
                    <p className="max-w-sm text-slate-400 leading-relaxed text-[15px]">
                        The unified resource management platform for university faculties. Optimizing campus equipment and laboratory utilization since 2026.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Platform</h3>
                    <ul className="space-y-4 text-[14px]">
                        <li><a href="/dashboard" className="hover:text-brand-accent transition-colors">Dashboard</a></li>
                        <li><a href="/resources" className="hover:text-brand-accent transition-colors">Resources</a></li>
                        <li><a href="/bookings" className="hover:text-brand-accent transition-colors">Bookings</a></li>
                        <li><a href="/maintenance" className="hover:text-brand-accent transition-colors">Maintenance</a></li>
                    </ul>
                </div>

                {/* Social / Legal */}
                <div>
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Connect</h3>
                    <div className="flex space-x-5 mb-8 text-slate-400">
                        <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">
                        &copy; {new Date().getFullYear()} UniLink. Built for Capstone Project G15.
                    </div>
                </div>
            </div>
        </footer>
    );
}
