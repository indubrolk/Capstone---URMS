"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useAnimation } from "framer-motion";
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

/* ── Stat Item ── */
function StatItem({ num, suffix, label }: { num: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const count = useCountUp(num, 1600, isInView);
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-1 p-6 rounded-3xl bg-card border border-slate-200 dark:border-border backdrop-blur-md shadow-lg"
    >
      <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        {count.toLocaleString()}<span className="text-cyan-400">{suffix}</span>
      </span>
      <span className="text-slate-600 dark:text-foreground/60 font-medium text-sm mt-2">{label}</span>
    </motion.div>
  );
}

export default function LandingPage() {
  const features = [
    { icon: <LayoutDashboard className="w-6 h-6" />, title: "Dashboard", desc: "Monitor all university resources in real-time with live analytics.", color: "from-blue-400 to-blue-600", glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]", iconColor: "text-blue-400" },
    { icon: <Calendar className="w-6 h-6" />, title: "Smart Booking", desc: "Reserve labs & halls without scheduling conflicts.", color: "from-violet-400 to-violet-600", glow: "shadow-[0_0_15px_rgba(139,92,246,0.3)]", iconColor: "text-violet-400" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Secure Access", desc: "Role-based authentication keeps data safe.", color: "from-emerald-400 to-emerald-600", glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]", iconColor: "text-emerald-400" },
    { icon: <Users className="w-6 h-6" />, title: "Multi-User", desc: "Students, staff, and admins — all supported.", color: "from-rose-400 to-rose-600", glow: "shadow-[0_0_15px_rgba(244,63,94,0.3)]", iconColor: "text-rose-400" },
    { icon: <Zap className="w-6 h-6" />, title: "Fast Performance", desc: "Lightning-fast operations across the entire system.", color: "from-amber-400 to-amber-600", glow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]", iconColor: "text-amber-400" },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Analytics", desc: "Track usage trends and generate detailed reports.", color: "from-cyan-400 to-cyan-600", glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]", iconColor: "text-cyan-400" },
  ];

  const steps = [
    { icon: <BookOpen className="w-5 h-5" />, step: "01", title: "Create Account", desc: "Sign up with your university email in seconds." },
    { icon: <Cpu className="w-5 h-5" />, step: "02", title: "Browse Resources", desc: "Search labs, equipment, and classrooms instantly." },
    { icon: <Building2 className="w-5 h-5" />, step: "03", title: "Book & Manage", desc: "Reserve resources and track bookings in one place." },
  ];

  const fadeInUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-cyan-500/30">

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-24 overflow-hidden min-h-screen flex items-center">

        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse duration-1000" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-left lg:pr-12">
                {/* Badge */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="inline-flex items-center gap-2 bg-slate-50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-cyan-400 text-xs font-bold px-4 py-2 rounded-full mb-8 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                >
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block" />
                    University Resource Management System — SUSL
                </motion.div>

                {/* Headline */}
                <motion.h1 
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6"
                >
                    Smart Campus
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500">
                    Resource Hub
                    </span>
                </motion.h1>

                <motion.p 
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
                >
                    Manage labs, classrooms, and equipment effortlessly with{" "}
                    <span className="font-bold text-white">UniLink</span> — the all-in-one platform built for modern universities.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="flex flex-wrap gap-4 mb-16"
                >
                    <Link
                    href="/login"
                    className="relative overflow-hidden inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.03] transition-all duration-300 group"
                    >
                    <div className="absolute inset-0 bg-slate-200 dark:bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <span className="relative z-10 flex items-center gap-2">
                        Get Started Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    </Link>
                    <Link
                    href="/resources"
                    className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-foreground rounded-2xl border border-slate-200 dark:border-border bg-card hover:bg-slate-100 dark:bg-white/10 backdrop-blur-md transition-all duration-300 group"
                    >
                    Browse Resources
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Trust badges */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-foreground/60"
                >
                    {["Free for all SUSL students", "Role-based access control", "Real-time availability"].map((t) => (
                    <span key={t} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {t}
                    </span>
                    ))}
                </motion.div>
            </div>

            {/* Floating UI mockup card */}
            <motion.div 
                initial={{ opacity: 0, x: 50, rotateY: -15 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex-1 relative perspective-1000 hidden lg:block"
            >
                <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="relative bg-card/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-border shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden transform-gpu"
                >
                    {/* Window chrome */}
                    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5 bg-slate-50 dark:bg-white/5">
                        <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        <span className="ml-4 text-xs text-slate-500 font-mono">unilink.susl.edu/dashboard</span>
                    </div>
                    {/* Mock dashboard content */}
                    <div className="p-6">
                        <div className="grid grid-cols-3 gap-4 mb-5">
                        {[
                            { label: "Labs Available", val: "12", color: "from-blue-500/20 to-blue-600/20 text-blue-400 border-blue-500/30" },
                            { label: "Active Bookings", val: "47", color: "from-violet-500/20 to-violet-600/20 text-violet-400 border-violet-500/30" },
                            { label: "Equipment", val: "238", color: "from-emerald-500/20 to-emerald-600/20 text-emerald-400 border-emerald-500/30" },
                        ].map((c) => (
                            <div key={c.label} className={`bg-gradient-to-br ${c.color} border rounded-2xl p-4 backdrop-blur-sm`}>
                            <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-1">{c.label}</p>
                            <p className="text-2xl font-black">{c.val}</p>
                            </div>
                        ))}
                        </div>
                        <div className="h-24 bg-slate-50 dark:bg-white/5 border border-white/5 rounded-2xl flex items-end justify-between gap-2 px-6 pt-4 pb-2">
                        {[60, 80, 45, 90, 70, 55, 85, 65, 75, 50, 88, 72].map((h, i) => (
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                key={i} 
                                className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-sm opacity-80" 
                            />
                        ))}
                        </div>
                    </div>
                </motion.div>
                {/* Glow behind the mockup */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/20 blur-[100px] -z-10 rounded-full" />
            </motion.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-20 relative z-10 -mt-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <StatItem num={50} suffix="+" label="Labs & Halls" />
          <StatItem num={1200} suffix="+" label="Equipment Items" />
          <StatItem num={15000} suffix="+" label="Active Students" />
          <StatItem num={99} suffix="%" label="System Uptime" />
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <span className="inline-block text-cyan-400 font-bold text-sm uppercase tracking-widest mb-3">Features</span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">Everything you need</h2>
            <p className="text-slate-600 dark:text-foreground/60 text-lg max-w-xl mx-auto">A complete toolkit for managing university resources efficiently.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div
                variants={fadeInUp}
                key={i}
                className="bg-card border border-slate-200 dark:border-border rounded-3xl p-8 backdrop-blur-md hover:bg-slate-100 dark:bg-white/10 transition-all duration-300 group cursor-default hover:-translate-y-2 hover:border-slate-300 dark:border-white/20 relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${f.glow} ${f.iconColor}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-xl text-foreground mb-3">{f.title}</h3>
                <p className="text-slate-600 dark:text-foreground/60 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 relative overflow-hidden bg-white/[0.02] border-y border-white/5">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <span className="inline-block text-cyan-400 font-bold text-sm uppercase tracking-widest mb-3">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">Up and running in minutes</h2>
            <p className="text-slate-600 dark:text-foreground/60 text-lg">Three simple steps to start managing resources smarter.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            {/* Connector line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {steps.map((s, i) => (
              <motion.div variants={fadeInUp} key={i} className="relative text-center group">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-background border border-slate-200 dark:border-border group-hover:border-cyan-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-300 relative z-10 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-50 dark:bg-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute top-2 right-2 w-6 h-6 bg-cyan-500/20 text-cyan-400 text-[10px] font-black rounded-full flex items-center justify-center border border-cyan-500/30">{s.step}</span>
                  <span className="text-foreground group-hover:text-cyan-400 transition-colors w-8 h-8 flex items-center justify-center">{s.icon}</span>
                </div>
                <h3 className="font-bold text-xl text-foreground mb-3">{s.title}</h3>
                <p className="text-slate-600 dark:text-foreground/60 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIAL STRIP ─── */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
          </div>
          <blockquote className="text-2xl md:text-3xl font-bold text-foreground mb-6 leading-relaxed">
            "UniLink transformed how we manage our engineering labs. Booking conflicts dropped to zero."
          </blockquote>
          <p className="text-cyan-400 text-sm font-bold tracking-widest uppercase">Faculty of Engineering, SUSL</p>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 to-background" />
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative max-w-3xl mx-auto px-6 text-center z-10 bg-card backdrop-blur-xl border border-slate-200 dark:border-border p-12 rounded-[3rem] shadow-2xl"
        >
          <span className="inline-block text-cyan-400 font-bold text-sm uppercase tracking-widest mb-4">Get Started</span>
          <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
            Ready to simplify<br />campus life?
          </h2>
          <p className="text-slate-600 dark:text-foreground/60 text-lg mb-10 max-w-lg mx-auto">
            Join thousands of SUSL students and staff already using UniLink to manage resources smarter.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="relative overflow-hidden inline-flex items-center gap-2 px-10 py-4 text-base font-bold text-white rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.04] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-slate-200 dark:bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2">
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-10 py-4 text-base font-bold text-foreground rounded-2xl border border-slate-200 dark:border-border hover:border-cyan-500/50 hover:bg-slate-50 dark:bg-white/5 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}