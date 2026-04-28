"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Landmark,
  ArrowRight,
  Calendar,
  ShieldCheck,
  Users,
  Zap,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    {
      icon: <LayoutDashboard />,
      title: "Dashboard",
      desc: "Monitor all university resources in real-time.",
    },
    {
      icon: <Calendar />,
      title: "Smart Booking",
      desc: "Reserve labs & halls without conflicts.",
    },
    {
      icon: <ShieldCheck />,
      title: "Secure Access",
      desc: "Role-based authentication system.",
    },
    {
      icon: <Users />,
      title: "Multi Users",
      desc: "Students, staff, and admins supported.",
    },
    {
      icon: <Zap />,
      title: "Fast Performance",
      desc: "Lightning-fast system operations.",
    },
    {
      icon: <TrendingUp />,
      title: "Analytics",
      desc: "Track usage and generate reports.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white overflow-x-hidden">
      {/* ─── NAVBAR ─── */}
      

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-20 text-center relative">
        {/* Glow */}
        <div className="absolute w-[400px] h-[400px] bg-blue-500 blur-[150px] opacity-20 top-10 left-1/2 -translate-x-1/2"></div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          Smart University <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Resource Management
          </span>
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto mb-10">
          Manage labs, classrooms, and equipment efficiently with UniLink —
          built for modern universities.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="bg-blue-500 px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-blue-600 transition"
          >
            Get Started <ArrowRight size={18} />
          </Link>

          <button className="border border-white/20 px-8 py-4 rounded-full hover:bg-white/10 transition">
            Learn More
          </button>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-14">
          Core Features
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition group"
            >
              <div className="text-blue-400 mb-4 group-hover:scale-110 transition">
                {f.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-20 bg-[#0F1629]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 text-center gap-8 px-6">
          {[
            { num: "50+", label: "Labs" },
            { num: "1200+", label: "Equipment" },
            { num: "15K+", label: "Students" },
            { num: "99%", label: "Uptime" },
          ].map((s, i) => (
            <div key={i}>
              <h3 className="text-4xl font-bold text-blue-400">
                {s.num}
              </h3>
              <p className="text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to get started?
        </h2>
        <p className="text-gray-400 mb-8">
          Join UniLink and simplify your university management.
        </p>

        <Link
          href="/login"
          className="bg-gradient-to-r from-blue-500 to-purple-500 px-10 py-4 rounded-full font-semibold hover:opacity-90 transition"
        >
          Create Account
        </Link>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        © 2026 UniLink · SUSL
      </footer>
    </div>
  );
}