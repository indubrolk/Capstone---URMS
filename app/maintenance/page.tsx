"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  CalendarDays,
  Wrench,
  Activity,
  ShieldAlert
} from "lucide-react";

// Types
interface MaintenanceTicket {
  id: number;
  resourceId: number;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'High' | 'Medium' | 'Low';
  createdBy: string;
  assignedTo?: string;
  created_at: string;
  completed_at?: string;
  outcome?: string;
}

// Map the DB interface to the UI interface
interface MaintenanceTask {
  id: string;
  resourceName: string;
  description: string;
  requestedDate: string;
  dueDate: string | null;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo?: string;
}

export default function AdminMaintenanceDashboard() {
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed' | 'Overdue'>('All');
  const [mounted, setMounted] = useState(false);

  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/maintenance-tickets', {
        headers: {
            // Include user token if using useAuth here, but skipping for minimal UI since this is just rendering the list
            'Authorization': `Bearer dev-token`
        }
      });
      if (res.ok) {
        const data: MaintenanceTicket[] = await res.json();
        const mapped: MaintenanceTask[] = data.map(ticket => ({
          id: `REQ-${ticket.id.toString().padStart(3, '0')}`,
          resourceName: `Resource #${ticket.resourceId}`, // Could fetch resource name if needed, but for minimal UI this is fine
          description: ticket.description || ticket.title,
          requestedDate: new Date(ticket.created_at).toISOString().split('T')[0],
          dueDate: null, // Depending on priority?
          status: ticket.status === 'OPEN' ? 'Pending' : ticket.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed',
          priority: ticket.priority,
          assignedTo: ticket.assignedTo
        }));
        setTasks(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch maintenance tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getCurrentDateStr();

  const isOverdue = (task: MaintenanceTask) => {
    if (!task.dueDate || task.status === 'Completed') return false;
    return task.dueDate < todayStr;
  };

  const tasksWithOverdue = useMemo(() => {
    return tasks.map(task => ({
      ...task,
      overdue: isOverdue(task)
    }));
  }, [todayStr, tasks]);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'Pending':
        return tasksWithOverdue.filter(t => t.status === 'Pending' || t.status === 'In Progress');
      case 'Completed':
        return tasksWithOverdue.filter(t => t.status === 'Completed');
      case 'Overdue':
        return tasksWithOverdue.filter(t => t.overdue);
      default:
        return tasksWithOverdue;
    }
  }, [filter, tasksWithOverdue]);

  const stats = useMemo(() => {
    return {
      total: tasksWithOverdue.length,
      pending: tasksWithOverdue.filter(t => t.status !== 'Completed').length,
      completed: tasksWithOverdue.filter(t => t.status === 'Completed').length,
      overdue: tasksWithOverdue.filter(t => t.overdue).length,
    };
  }, [tasksWithOverdue]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div 
          className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Wrench className="w-64 h-64 rotate-12 transform" />
          </div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-primary/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold tracking-wide text-blue-200 mb-4 border border-white/10">
                <ShieldAlert className="w-4 h-4" />
                Admin Console
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                Maintenance <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Overview</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl">
                Monitor facility health, track active repair requests, and identify critical overdue maintenance tasks.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  const title = prompt('Enter task title:');
                  if (!title) return;
                  const desc = prompt('Enter description:');
                  const resourceId = prompt('Enter resource ID (integer):');
                  if (!resourceId) return;
                  
                  fetch('http://localhost:5000/api/maintenance-tickets', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer dev-token'
                    },
                    body: JSON.stringify({
                      title,
                      description: desc,
                      resourceId: parseInt(resourceId),
                      priority: 'Medium'
                    })
                  }).then(res => {
                    if (res.ok) fetchTasks();
                    else alert('Failed to create task');
                  });
                }}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-xl text-white font-bold transition-all border border-white/20 shadow-lg flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                Create Task
              </button>
              {stats.overdue > 0 && (
                <div 
                  className="bg-red-500/10 border border-red-500/20 backdrop-blur-md px-6 py-4 rounded-2xl flex items-center gap-4 animate-in fade-in zoom-in duration-500"
                >
                  <div className="bg-red-500/20 p-3 rounded-full text-red-400 animate-pulse">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-red-400 font-bold text-sm uppercase tracking-wider">Critical Attention</div>
                    <div className="text-white font-extrabold text-2xl">{stats.overdue} Tasks Overdue</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Requests" 
            value={stats.total} 
            icon={ListTodo} 
            color="blue"
            active={filter === 'All'}
            onClick={() => setFilter('All')}
          />
          <StatCard 
            title="Active / Pending" 
            value={stats.pending} 
            icon={Activity} 
            color="amber"
            active={filter === 'Pending'}
            onClick={() => setFilter('Pending')}
          />
          <StatCard 
            title="Tasks Completed" 
            value={stats.completed} 
            icon={CheckCircle2} 
            color="emerald"
            active={filter === 'Completed'}
            onClick={() => setFilter('Completed')}
          />
          <StatCard 
            title="Overdue Tasks" 
            value={stats.overdue} 
            icon={AlertTriangle} 
            color="red"
            active={filter === 'Overdue'}
            onClick={() => setFilter('Overdue')}
            isAlert={stats.overdue > 0}
          />
        </div>

        {/* Data Table Section */}
        <div 
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              Task Directory
              {filter !== 'All' && (
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full border border-slate-200">
                  {filter}
                </span>
              )}
            </h2>
            <div className="flex bg-slate-100 p-1 rounded-xl">
               {['All', 'Pending', 'Completed', 'Overdue'].map((f) => (
                 <button
                   key={f}
                   onClick={() => setFilter(f as any)}
                   className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                     filter === f 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                   }`}
                 >
                   {f}
                 </button>
               ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-bold text-slate-500 text-sm uppercase tracking-wider">ID / Resource</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Issue Description</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Timeline</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-sm uppercase tracking-wider hidden md:table-cell">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr 
                    key={task.id}
                    className={`group transition-colors hover:bg-slate-50 ${task.overdue ? 'bg-red-50/30' : ''}`}
                  >
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-start gap-3">
                        {task.overdue ? (
                          <div className="mt-1 text-red-500 animate-pulse" title="Task is overdue!">
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="mt-1 text-slate-400">
                            <Wrench className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{task.id}</div>
                          <div className="text-sm font-medium text-slate-500 mt-0.5">{task.resourceName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <p className="text-slate-700 font-medium line-clamp-2 max-w-sm">
                        {task.description}
                      </p>
                      {task.assignedTo && (
                        <div className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                          {task.assignedTo}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 align-top">
                      <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <CalendarDays className="w-4 h-4 text-slate-400" />
                          {task.requestedDate}
                        </div>
                        {task.dueDate && (
                          <div className={`flex items-center gap-2 font-bold ${task.overdue ? 'text-red-600' : 'text-slate-500'}`}>
                            <Clock className="w-4 h-4" />
                            {task.dueDate}
                            {task.overdue && <span className="text-[10px] uppercase tracking-wider bg-red-100 text-red-700 px-1.5 py-0.5 rounded ml-1">Overdue</span>}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <Badge type="status" value={task.status} overdue={task.overdue} />
                    </td>
                    <td className="px-6 py-5 align-top hidden md:table-cell">
                      <Badge type="priority" value={task.priority} />
                    </td>
                  </tr>
                ))}
                
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 text-slate-400">
                        <ActTriangle className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">No tasks found</h3>
                      <p className="text-slate-500 mt-1">There are no maintenance tasks matching the '{filter}' filter.</p>
                      <button 
                        onClick={() => setFilter('All')}
                        className="mt-4 text-brand-primary font-bold hover:underline"
                      >
                        Clear Filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components

function ActTriangle(props: any) {
    return <AlertTriangle {...props} />;
}

function StatCard({ title, value, icon: Icon, color, active, onClick, isAlert }: any) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-200 group-hover:bg-blue-600 group-hover:text-white",
    amber: "bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-500 group-hover:text-white",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200 group-hover:bg-emerald-500 group-hover:text-white",
    red: "bg-red-50 text-red-600 border-red-200 group-hover:bg-red-600 group-hover:text-white",
  };

  const bgStyles = {
    blue: active ? "border-brand-primary shadow-brand-primary/20 ring-1 ring-brand-primary" : "border-slate-100 hover:border-blue-200",
    amber: active ? "border-amber-500 shadow-amber-500/20 ring-1 ring-amber-500" : "border-slate-100 hover:border-amber-200",
    emerald: active ? "border-emerald-500 shadow-emerald-500/20 ring-1 ring-emerald-500" : "border-slate-100 hover:border-emerald-200",
    red: active ? "border-red-500 shadow-red-500/20 ring-1 ring-red-500" : "border-slate-100 hover:border-red-200",
  };

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-in fade-in zoom-in duration-500 ${bgStyles[color as keyof typeof bgStyles]} ${isAlert ? 'animate-pulse' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl border transition-colors duration-300 ${colorStyles[color as keyof typeof colorStyles]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 font-semibold text-sm mb-1 group-hover:text-slate-600 transition-colors uppercase tracking-wider">{title}</h3>
        <p className="text-4xl font-extrabold text-slate-800 transition-colors">{value}</p>
      </div>
    </div>
  );
}

function Badge({ type, value, overdue }: { type: 'status' | 'priority', value: string, overdue?: boolean }) {
  if (type === 'status') {
    if (overdue) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping absolute"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 relative"></span>
          Overdue
        </span>
      );
    }
    
    switch (value) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Pending</span>;
      case 'In Progress':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>In Progress</span>;
      case 'Completed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Completed</span>;
      default:
        return <span>{value}</span>;
    }
  }

  // Priority
  switch (value) {
    case 'High':
      return <span className="inline-flex px-3 py-1 rounded-lg text-xs font-bold text-amber-700 bg-amber-50">High</span>;
    case 'Medium':
      return <span className="inline-flex px-3 py-1 rounded-lg text-xs font-bold text-slate-600 bg-slate-100">Medium</span>;
    case 'Low':
      return <span className="inline-flex px-3 py-1 rounded-lg text-xs font-bold text-slate-500 bg-slate-50">Low</span>;
    default:
      return <span>{value}</span>;
  }
}
