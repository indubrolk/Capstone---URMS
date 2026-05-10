"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  ShieldCheck,
  Users,
  Zap,
  TrendingUp,
  LayoutDashboard,
  CheckCircle2,
  Star,
  ChevronRight,
  BookOpen,
  Cpu,
  Building2,
} from "lucide-react";

/* ── Animated Counter Hook ── */
function useCountUp(target: number, duration = 1800, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, target, duration]);
  return count;
}

/* ── Intersection Observer Hook ── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ── Stat Item ── */
function StatItem({ num, suffix, label, inView }: { num: number; suffix: string; label: string; inView: boolean }) {
  const count = useCountUp(num, 1600, inView);
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-4xl md:text-5xl font-black text-slate-900">
        {count.toLocaleString()}<span className="text-brand-primary">{suffix}</span>
      </span>
      <span className="text-slate-500 font-medium text-sm">{label}</span>
    </div>
  );
}

export default function LandingPage() {
  const statsSection = useInView(0.3);

  const features = [
    { icon: <LayoutDashboard className="w-6 h-6" />, title: "Dashboard", desc: "Monitor all university resources in real-time with live analytics.", color: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
    { icon: <Calendar className="w-6 h-6" />, title: "Smart Booking", desc: "Reserve labs & halls without scheduling conflicts.", color: "from-violet-500 to-violet-600", bg: "bg-violet-50", text: "text-violet-600" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Secure Access", desc: "Role-based authentication keeps data safe.", color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-600" },
    { icon: <Users className="w-6 h-6" />, title: "Multi-User", desc: "Students, staff, and admins — all supported.", color: "from-rose-500 to-rose-600", bg: "bg-rose-50", text: "text-rose-600" },
    { icon: <Zap className="w-6 h-6" />, title: "Fast Performance", desc: "Lightning-fast operations across the entire system.", color: "from-amber-500 to-amber-600", bg: "bg-amber-50", text: "text-amber-600" },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Analytics", desc: "Track usage trends and generate detailed reports.", color: "from-cyan-500 to-cyan-600", bg: "bg-cyan-50", text: "text-cyan-600" },
  ];

  const steps = [
    { icon: <BookOpen className="w-5 h-5" />, step: "01", title: "Create Account", desc: "Sign up with your university email in seconds." },
    { icon: <Cpu className="w-5 h-5" />, step: "02", title: "Browse Resources", desc: "Search labs, equipment, and classrooms instantly." },
    { icon: <Building2 className="w-5 h-5" />, step: "03", title: "Book & Manage", desc: "Reserve resources and track bookings in one place." },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse-ring { 0%{transform:scale(0.95);opacity:0.7} 100%{transform:scale(1.15);opacity:0} }
        @keyframes slide-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fade-in { from{opacity:0} to{opacity:1} }
        @keyframes shimmer-line { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes blob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-blob { animation: blob 8s ease-in-out infinite; }
        .animate-blob-delay { animation: blob 8s ease-in-out 2s infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease forwards; }
        .animate-fade-in { animation: fade-in 0.8s ease forwards; }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .card-hover { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(27,92,201,0.12); }
        .shimmer-btn { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); background-size: 200% auto; }
        .shimmer-btn:hover { animation: shimmer-line 1.2s linear infinite; }
        .feature-icon-wrap { transition: transform 0.3s ease; }
        .card-hover:hover .feature-icon-wrap { transform: scale(1.15) rotate(-5deg); }
      `}</style>

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-24 overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-[-80px] right-[-120px] w-[500px] h-[500px] bg-blue-100 opacity-60 animate-blob" style={{ filter: "blur(60px)" }} />
        <div className="absolute bottom-[-60px] left-[-100px] w-[400px] h-[400px] bg-violet-100 opacity-50 animate-blob-delay" style={{ filter: "blur(60px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-50 to-violet-50 rounded-full opacity-70" style={{ filter: "blur(80px)" }} />

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(circle, #1B5CC9 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative max-w-6xl mx-auto px-6 text-center">

          {/* Badge */}
          <div className="animate-slide-up inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
            University Resource Management System — SUSL
          </div>

          {/* Headline */}
          <h1 className="animate-slide-up delay-100 text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            Smart Campus
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-blue-500 to-violet-500">
              Resource Hub
            </span>
          </h1>

          <p className="animate-slide-up delay-200 text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Manage labs, classrooms, and equipment effortlessly with{" "}
            <span className="font-bold text-slate-700">UniLink</span> — the all-in-one platform built for modern universities.
          </p>

          {/* CTA Buttons */}
          <div className="animate-slide-up delay-300 flex flex-wrap justify-center gap-4 mb-16">
            <Link
              href="/login"
              className="relative overflow-hidden inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white rounded-2xl bg-gradient-to-r from-brand-primary to-blue-600 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.03] transition-all duration-300 group"
            >
              <span className="shimmer-btn absolute inset-0 rounded-2xl" />
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-slate-700 rounded-2xl border-2 border-slate-200 bg-white hover:border-brand-primary hover:text-brand-primary hover:bg-blue-50 transition-all duration-300 group"
            >
              Browse Resources
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="animate-fade-in delay-400 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            {["Free for all SUSL students", "Role-based access control", "Real-time availability"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Floating UI mockup card */}
        <div className="relative max-w-4xl mx-auto px-6 mt-16 animate-float">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/80 overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-4 text-xs text-slate-400 font-mono">unilink.susl.edu/dashboard</span>
            </div>
            {/* Mock dashboard content */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-white">
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                  { label: "Labs Available", val: "12", color: "bg-blue-100 text-blue-700" },
                  { label: "Active Bookings", val: "47", color: "bg-violet-100 text-violet-700" },
                  { label: "Equipment", val: "238", color: "bg-emerald-100 text-emerald-700" },
                ].map((c) => (
                  <div key={c.label} className={`${c.color} rounded-2xl p-4`}>
                    <p className="text-xs font-semibold opacity-70">{c.label}</p>
                    <p className="text-2xl font-black mt-1">{c.val}</p>
                  </div>
                ))}
              </div>
              <div className="h-24 bg-gradient-to-r from-blue-100 via-violet-100 to-blue-100 rounded-2xl flex items-center justify-center gap-3 px-6">
                {[60, 80, 45, 90, 70, 55, 85, 65, 75, 50, 88, 72].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-brand-primary to-blue-400 rounded-full opacity-80 transition-all" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
          {/* Shadow beneath */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-blue-200/40 blur-2xl rounded-full" />
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section ref={statsSection.ref} className="py-16 bg-gradient-to-r from-brand-primary via-blue-600 to-violet-600">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <StatItem num={50} suffix="+" label="Labs & Halls" inView={statsSection.inView} />
          <StatItem num={1200} suffix="+" label="Equipment Items" inView={statsSection.inView} />
          <StatItem num={15000} suffix="+" label="Active Students" inView={statsSection.inView} />
          <StatItem num={99} suffix="%" label="System Uptime" inView={statsSection.inView} />
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block text-brand-primary font-bold text-sm uppercase tracking-widest mb-3">Features</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Everything you need</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">A complete toolkit for managing university resources efficiently.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="card-hover bg-white border border-slate-100 rounded-3xl p-7 shadow-sm group cursor-default"
              >
                <div className={`feature-icon-wrap w-12 h-12 ${f.bg} ${f.text} rounded-2xl flex items-center justify-center mb-5`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                <div className={`mt-5 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${f.color} rounded-full transition-all duration-500`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block text-brand-primary font-bold text-sm uppercase tracking-widest mb-3">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Up and running in minutes</h2>
            <p className="text-slate-500 text-lg">Three simple steps to start managing resources smarter.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] right-[-calc(50%-40px)] h-px bg-gradient-to-r from-slate-300 to-transparent" />
                )}
                <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-white border-2 border-slate-200 group-hover:border-brand-primary flex items-center justify-center shadow-md group-hover:shadow-blue-200 group-hover:shadow-lg transition-all duration-300 relative">
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">{s.step}</span>
                  <span className="text-brand-primary">{s.icon}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL STRIP ─── */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
          </div>
          <blockquote className="text-2xl font-bold text-slate-800 mb-4 leading-snug">
            "UniLink transformed how we manage our engineering labs. Booking conflicts dropped to zero."
          </blockquote>
          <p className="text-slate-500 text-sm font-semibold">Faculty of Engineering, SUSL</p>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 opacity-20 rounded-full" style={{ filter: "blur(100px)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600 opacity-20 rounded-full" style={{ filter: "blur(80px)" }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block text-blue-400 font-bold text-sm uppercase tracking-widest mb-4">Get Started</span>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ready to simplify<br />campus life?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
            Join thousands of SUSL students and staff already using UniLink to manage resources smarter.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="relative overflow-hidden inline-flex items-center gap-2 px-10 py-4 text-base font-bold text-white rounded-2xl bg-gradient-to-r from-brand-primary to-blue-500 shadow-2xl shadow-blue-500/40 hover:scale-[1.04] hover:shadow-blue-500/60 transition-all duration-300 group"
            >
              <span className="shimmer-btn absolute inset-0 rounded-2xl" />
              Create Free Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-10 py-4 text-base font-bold text-white rounded-2xl border-2 border-white/20 hover:border-white/50 hover:bg-white/10 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}