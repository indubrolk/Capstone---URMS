"use client";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BarChart3, Users, Package, CalendarCheck, AlertCircle, CheckCircle2, Calendar, ShieldAlert, Clock, BookOpen, PenTool, TrendingUp, Zap, ArrowRight, Activity, Wrench, Bell, ChevronRight, Star } from "lucide-react";

const css = `
@keyframes slide-up{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fade-in{from{opacity:0}to{opacity:1}}
@keyframes count-up{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}
.s1{animation:slide-up .5s ease .05s both}
.s2{animation:slide-up .5s ease .15s both}
.s3{animation:slide-up .5s ease .25s both}
.s4{animation:slide-up .5s ease .35s both}
.s5{animation:slide-up .5s ease .45s both}
.ch{transition:all .25s cubic-bezier(.4,0,.2,1)}
.ch:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.08)}
`;

function StatCard({ title, value, icon, color, bg, border, trend }: any) {
  return (
    <div className={`ch bg-white rounded-3xl border ${border} p-6 shadow-sm`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>{icon}</div>
        {trend && <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3"/>{trend}</span>}
      </div>
      <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
      <p className="text-sm font-semibold text-slate-400">{title}</p>
    </div>
  );
}

function QuickLink({ href, label, icon, color }: any) {
  return (
    <Link href={href} className={`ch flex items-center justify-between p-4 bg-white border border-slate-100 hover:border-brand-primary/30 hover:bg-blue-50 rounded-2xl group`}>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>{icon}</div>
        <span className="text-sm font-bold text-slate-700 group-hover:text-brand-primary transition-colors">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all"/>
    </Link>
  );
}

function ActivityRow({ text, time, color }: any) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${color}`}/>
        <p className="text-sm font-semibold text-slate-700">{text}</p>
      </div>
      <span className="text-xs text-slate-400 font-medium">{time}</span>
    </div>
  );
}

function AdminDashboard({ profile }: { profile: any }) {
  return (
    <div className="space-y-6">
      <style>{css}</style>
      {/* Header */}
      <div className="s1 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:"radial-gradient(circle,white 1px,transparent 1px)",backgroundSize:"24px 24px"}}/>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"/>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-xs font-bold px-3 py-1 rounded-full"><Activity className="w-3 h-3 text-emerald-400"/>System Operational</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Admin Console</h1>
          <p className="text-blue-200 font-medium">Welcome back, <span className="text-white font-bold">{profile?.name || "Admin"}</span>. Here's your system overview.</p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <Link href="/resources" className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all shadow-md hover:scale-[1.02] active:scale-95">
              <Package className="w-4 h-4"/>Manage Resources
            </Link>
            <Link href="/maintenance" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all">
              <Bell className="w-4 h-4"/>View Alerts
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="s2 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Users" value="842" trend="+12%" icon={<Users className="w-5 h-5 text-blue-600"/>} bg="bg-blue-50" border="border-blue-100"/>
        <StatCard title="Resources" value="156" trend="+3%" icon={<Package className="w-5 h-5 text-violet-600"/>} bg="bg-violet-50" border="border-violet-100"/>
        <StatCard title="Bookings Today" value="47" trend="+8%" icon={<CalendarCheck className="w-5 h-5 text-emerald-600"/>} bg="bg-emerald-50" border="border-emerald-100"/>
        <StatCard title="Open Alerts" value="2" icon={<ShieldAlert className="w-5 h-5 text-red-500"/>} bg="bg-red-50" border="border-red-100"/>
      </div>

      {/* Main content */}
      <div className="s3 grid lg:grid-cols-3 gap-6">
        {/* Activity */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-slate-900">Recent Activity</h3>
            <span className="text-xs font-bold text-brand-primary bg-blue-50 px-3 py-1 rounded-full">Live</span>
          </div>
          <ActivityRow text="New user registration approved — Sarah K." time="2m ago" color="bg-emerald-400"/>
          <ActivityRow text="Resource booking: Physics Lab A confirmed" time="15m ago" color="bg-blue-400"/>
          <ActivityRow text="Maintenance ticket #042 marked resolved" time="1h ago" color="bg-violet-400"/>
          <ActivityRow text="System backup completed successfully" time="3h ago" color="bg-amber-400"/>
          <ActivityRow text="Admin report generated for October" time="5h ago" color="bg-slate-400"/>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-base font-black text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <QuickLink href="/resources" label="Manage Resources" icon={<Package className="w-4 h-4 text-blue-600"/>} color="bg-blue-50"/>
              <QuickLink href="/bookings" label="All Bookings" icon={<CalendarCheck className="w-4 h-4 text-violet-600"/>} color="bg-violet-50"/>
              <QuickLink href="/maintenance" label="Maintenance Tickets" icon={<Wrench className="w-4 h-4 text-amber-600"/>} color="bg-amber-50"/>
              <QuickLink href="/profile" label="User Settings" icon={<Users className="w-4 h-4 text-emerald-600"/>} color="bg-emerald-50"/>
            </div>
          </div>
          {/* System health */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"/>
              <h4 className="text-sm font-black text-slate-800">System Health</h4>
            </div>
            {[["Database","99.9%","bg-emerald-400"],["API Server","98.2%","bg-emerald-400"],["Auth Service","100%","bg-emerald-400"]].map(([k,v,c])=>(
              <div key={k} className="flex items-center justify-between py-1.5">
                <span className="text-xs font-semibold text-slate-600">{k}</span>
                <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${c}`}/><span className="text-xs font-bold text-emerald-700">{v}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="s4 grid md:grid-cols-3 gap-4">
        {[["Labs","12","bg-blue-500"],["Classrooms","28","bg-violet-500"],["Equipment","116","bg-amber-500"]].map(([label,val,color])=>(
          <div key={label} className="ch bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white text-xl font-black shadow-md`}>{val}</div>
            <div><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Available</p><p className="text-base font-black text-slate-900">{label}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LecturerDashboard({ profile }: { profile: any }) {
  return (
    <div className="space-y-6">
      <style>{css}</style>
      <div className="s1 relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl"/>
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2">Teacher Portal 🎓</h1>
          <p className="text-indigo-200">Hello, <span className="text-white font-bold">{profile?.name || "Lecturer"}</span>. You have <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold">3 pending approvals</span>.</p>
          <div className="flex gap-3 mt-5">
            <Link href="/bookings" className="bg-white text-indigo-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-all shadow-md">My Bookings</Link>
            <Link href="/resources" className="bg-white/15 border border-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/25 transition-all">Browse Resources</Link>
          </div>
        </div>
      </div>
      <div className="s2 grid grid-cols-3 gap-4">
        <StatCard title="My Bookings" value="8" icon={<CalendarCheck className="w-5 h-5 text-indigo-600"/>} bg="bg-indigo-50" border="border-indigo-100"/>
        <StatCard title="Pending" value="3" icon={<Clock className="w-5 h-5 text-amber-600"/>} bg="bg-amber-50" border="border-amber-100"/>
        <StatCard title="Completed" value="24" icon={<CheckCircle2 className="w-5 h-5 text-emerald-600"/>} bg="bg-emerald-50" border="border-emerald-100"/>
      </div>
      <div className="s3 grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
          <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600"/>Pending Requests</h3>
          {[["Advanced Physics Lab","John Doe"],["Computer Lab B","Mary Silva"],["Seminar Room 2","Ali Hassan"]].map(([room,student])=>(
            <div key={room} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-2">
              <div><p className="font-bold text-sm text-slate-800">{room}</p><p className="text-xs text-slate-400">{student}</p></div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">Deny</button>
                <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors">Approve</button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
          <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-600"/>Upcoming Classes</h3>
          {[["Quantum Mechanics 101","Main Hall • 10:00 AM","Oct 12"],["Thermodynamics","Lab B • 2:00 PM","Oct 14"],["Research Methods","Room 204 • 9:00 AM","Oct 16"]].map(([cls,loc,date])=>(
            <div key={cls} className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 mb-2">
              <div className="bg-indigo-100 text-indigo-800 font-black p-3 rounded-xl text-center text-xs leading-tight w-12 shrink-0"><span className="block uppercase text-[9px]">OCT</span><span className="block text-lg">{date.split(" ")[1]}</span></div>
              <div><p className="font-bold text-sm text-slate-800">{cls}</p><p className="text-xs text-slate-400">{loc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentDashboard({ profile }: { profile: any }) {
  return (
    <div className="space-y-6">
      <style>{css}</style>
      <div className="s1 relative overflow-hidden bg-gradient-to-br from-brand-primary via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"/>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-900/30 rounded-full blur-2xl"/>
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2">Student Hub 📚</h1>
          <p className="text-blue-200">Hi <span className="text-white font-bold">{profile?.name || "Student"}</span>, ready to book your next session?</p>
          <div className="flex gap-3 mt-5">
            <Link href="/resources" className="bg-white text-brand-primary font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all shadow-md">Browse Resources</Link>
            <Link href="/bookings" className="bg-white/15 border border-white/20 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/25 transition-all">My Bookings</Link>
          </div>
        </div>
      </div>
      <div className="s2 grid grid-cols-3 gap-4">
        <StatCard title="Active Bookings" value="3" icon={<Calendar className="w-5 h-5 text-blue-600"/>} bg="bg-blue-50" border="border-blue-100"/>
        <StatCard title="Resources Used" value="12" icon={<BookOpen className="w-5 h-5 text-violet-600"/>} bg="bg-violet-50" border="border-violet-100"/>
        <StatCard title="Hours Booked" value="18" icon={<Clock className="w-5 h-5 text-emerald-600"/>} bg="bg-emerald-50" border="border-emerald-100"/>
      </div>
      <div className="s3 grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
          <h3 className="font-black text-slate-900 mb-4">Upcoming Bookings</h3>
          {[["Library Study Room B","Today • 2:00 PM","bg-blue-500"],["Computer Lab 3","Tomorrow • 9:00 AM","bg-violet-500"],["Physics Lab A","Oct 14 • 11:00 AM","bg-amber-500"]].map(([room,time,dot])=>(
            <div key={room} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`}/>
              <div className="flex-1 min-w-0"><p className="font-bold text-sm text-slate-800 truncate">{room}</p><p className="text-xs text-slate-400">{time}</p></div>
              <button className="text-xs font-bold text-brand-primary border border-brand-primary/20 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">Details</button>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
          <h3 className="font-black text-slate-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            {[["Browse Labs","/resources","📐","bg-blue-50 border-blue-100"],["My History","/bookings","🕐","bg-violet-50 border-violet-100"],["Explore","/explore","🔍","bg-emerald-50 border-emerald-100"],["My Profile","/profile","👤","bg-amber-50 border-amber-100"]].map(([label,href,emoji,style])=>(
              <Link key={label} href={href} className={`ch flex flex-col items-center justify-center p-5 ${style} border rounded-2xl hover:scale-[1.03] transition-all`}>
                <span className="text-2xl mb-2">{emoji}</span>
                <span className="text-sm font-bold text-slate-700">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MaintenanceDashboard({ profile }: { profile: any }) {
  return (
    <div className="space-y-6">
      <style>{css}</style>
      <div className="s1 relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-56 h-56 bg-red-500/10 rounded-full blur-3xl"/>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-2"><PenTool className="w-7 h-7 text-amber-400"/>Operations Hub</h1>
            <p className="text-slate-400">Hi <span className="text-white font-bold">{profile?.name || "Technician"}</span>. <span className="text-red-400 font-bold">2 high-priority tickets</span> need attention.</p>
          </div>
          <button className="shrink-0 bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95 text-sm">Report Incident</button>
        </div>
      </div>
      <div className="s2 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Open Tickets" value="7" icon={<AlertCircle className="w-5 h-5 text-red-500"/>} bg="bg-red-50" border="border-red-100"/>
        <StatCard title="In Progress" value="3" icon={<Wrench className="w-5 h-5 text-amber-600"/>} bg="bg-amber-50" border="border-amber-100"/>
        <StatCard title="Resolved Today" value="5" icon={<CheckCircle2 className="w-5 h-5 text-emerald-600"/>} bg="bg-emerald-50" border="border-emerald-100"/>
        <StatCard title="Avg. Resolution" value="2.4h" icon={<Clock className="w-5 h-5 text-blue-600"/>} bg="bg-blue-50" border="border-blue-100"/>
      </div>
      <div className="s3 grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-red-100 rounded-3xl shadow-sm p-6">
          <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500"/>Critical Tasks</h3>
          {[["Projector Malfunction","Lecture Hall A","Urgent","bg-red-100 text-red-700"],["Server Room Cooling","IT Center","High","bg-orange-100 text-orange-700"]].map(([task,loc,prio,style])=>(
            <div key={task} className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-2xl mb-2">
              <div><p className="font-bold text-sm text-slate-800">{task}</p><p className="text-xs text-slate-400">{loc}</p></div>
              <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full ${style}`}>{prio}</span>
            </div>
          ))}
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
          <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500"/>Standard Queue</h3>
          {[["AC Filter Replacement","Computer Lab 3","Routine","bg-slate-100 text-slate-600"],["Light Fixture Repair","Room 204","Normal","bg-blue-100 text-blue-600"],["Whiteboard Replacement","Seminar Hall","Low","bg-emerald-100 text-emerald-700"]].map(([task,loc,prio,style])=>(
            <div key={task} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-2">
              <div><p className="font-bold text-sm text-slate-800">{task}</p><p className="text-xs text-slate-400">{loc}</p></div>
              <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-full ${style}`}>{prio}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const role = profile?.role || "student";
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {role === "admin"       && <AdminDashboard       profile={profile}/>}
          {role === "lecturer"    && <LecturerDashboard    profile={profile}/>}
          {role === "student"     && <StudentDashboard     profile={profile}/>}
          {role === "maintenance" && <MaintenanceDashboard profile={profile}/>}
        </div>
      </div>
    </ProtectedRoute>
  );
}
