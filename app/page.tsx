import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, ShieldCheck, Zap, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <LayoutDashboard className="w-6 h-6 text-brand-accent" />,
      title: "Centralized Dashboard",
      description: "Real-time visibility into equipment status and availability across all faculties."
    },
    {
      icon: <Calendar className="w-6 h-6 text-brand-accent" />,
      title: "Smart Scheduling",
      description: "Seamless booking system for lecture halls and laboratories with automated conflict detection."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-accent" />,
      title: "Access Control",
      description: "Secure, role-based access for students, faculty, and administrators."
    },
    {
      icon: <Zap className="w-6 h-6 text-brand-accent" />,
      title: "Instant Analytics",
      description: "Generate comprehensive reports on resource utilization trends to optimize budget allocation."
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-brand-primary/30 to-brand-accent/20 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-brand-primary/5 border border-brand-primary/10 rounded-full px-4 py-1 mb-8">
                <span className="flex h-2 w-2 rounded-full bg-brand-primary"></span>
                <span className="text-sm font-bold text-brand-primary uppercase tracking-wider">Next-Gen Management</span>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
                Elevate Campus <br />
                <span className="text-brand-primary">Resources.</span>
              </h1>
              <p className="mt-8 text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                UniLink provides an integrated ecosystem for tracking, booking, and managing high-end laboratory equipment and specialized university facilities across all faculties.
              </p>
              <div className="mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                <Link
                  href="/login"
                  className="rounded-full bg-brand-primary px-8 py-4 text-lg font-bold text-white shadow-xl hover:bg-brand-secondary transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#features"
                  className="rounded-full bg-white border border-slate-200 px-8 py-4 text-lg font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-3xl shadow-2xl overflow-hidden group">
                <img
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop"
                  alt="Modern University Campus"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <h2 className="text-base font-bold text-brand-primary tracking-widest uppercase mb-3">Capabilities</h2>
          <p className="text-4xl font-extrabold text-slate-900 tracking-tight">Everything you need for seamless efficiency</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 group">
              <div className="bg-brand-primary/5 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-primary transition-colors">
                {React.cloneElement(feature.icon as React.ReactElement<{ className?: string }>, {
                  className: "w-6 h-6 text-brand-primary group-hover:text-white transition-colors"
                })}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-brand-primary overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-2 lg:grid-cols-4 gap-12 text-center text-white">
          <div>
            <div className="text-5xl font-black mb-2 tracking-tighter">50+</div>
            <div className="text-brand-accent/80 font-bold uppercase tracking-widest text-xs">Laboratories</div>
          </div>
          <div>
            <div className="text-5xl font-black mb-2 tracking-tighter">1.2k</div>
            <div className="text-brand-accent/80 font-bold uppercase tracking-widest text-xs">Equipment Items</div>
          </div>
          <div>
            <div className="text-5xl font-black mb-2 tracking-tighter">15k</div>
            <div className="text-brand-accent/80 font-bold uppercase tracking-widest text-xs">Active Students</div>
          </div>
          <div>
            <div className="text-5xl font-black mb-2 tracking-tighter">99%</div>
            <div className="text-brand-accent/80 font-bold uppercase tracking-widest text-xs">Uptime Guarantee</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Ready to streamline your faculty resources?</h2>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Join hundreds of faculty members already using UniLink to optimize university efficiency.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-10 py-5 rounded-full bg-brand-primary text-white font-bold text-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            Create Your Account Today
          </Link>
        </div>
      </section>
    </div>
  );
}
