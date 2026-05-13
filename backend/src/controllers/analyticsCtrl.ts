import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { generatePDFReport, generateExcelReport } from "../services/exportService";

/**
 * Helper to apply department filtering to Supabase queries
 */
const applyDeptFilter = (query: any, department: string | undefined, joinPath?: string) => {
    if (!department) return query;
    if (joinPath) {
        return query.eq(`${joinPath}.department`, department);
    }
    return query.eq('department', department);
};

/**
 * GET /api/admin/analytics/overview
 * High-level summary metrics
 */
export const getOverviewAnalytics = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        const now = new Date().toISOString();
        const department = req.query.department as string;

        // 1. Resource Counts
        let resQuery = supabase.from('resources').select('*', { count: 'exact', head: true });
        resQuery = applyDeptFilter(resQuery, department);
        const { count: totalResources } = await resQuery;

        let maintQuery = supabase.from('resources').select('*', { count: 'exact', head: true }).eq('availability_status', 'Maintenance');
        maintQuery = applyDeptFilter(maintQuery, department);
        const { count: resourcesUnderMaintenance } = await maintQuery;

        // 2. Booking Counts
        // Note: For bookings we join with resources to filter by department
        let activeBookingsQuery = supabase
            .from('bookings')
            .select('*, resources!inner(department)', { count: 'exact', head: true })
            .eq('status', 'Approved')
            .gt('end_time', now);
        activeBookingsQuery = applyDeptFilter(activeBookingsQuery, department, 'resources');
        const { count: activeBookings } = await activeBookingsQuery;

        let completedBookingsQuery = supabase
            .from('bookings')
            .select('*, resources!inner(department)', { count: 'exact', head: true })
            .eq('status', 'Completed');
        completedBookingsQuery = applyDeptFilter(completedBookingsQuery, department, 'resources');
        const { count: completedBookings } = await completedBookingsQuery;

        // 3. Maintenance Counts
        let totalMaintQuery = supabase
            .from('maintenance_tickets')
            .select('*, resources!inner(department)', { count: 'exact', head: true });
        totalMaintQuery = applyDeptFilter(totalMaintQuery, department, 'resources');
        const { count: totalMaintenanceTickets } = await totalMaintQuery;

        let pendingMaintQuery = supabase
            .from('maintenance_tickets')
            .select('*, resources!inner(department)', { count: 'exact', head: true })
            .in('status', ['OPEN', 'IN_PROGRESS']);
        pendingMaintQuery = applyDeptFilter(pendingMaintQuery, department, 'resources');
        const { count: pendingMaintenanceTasks } = await pendingMaintQuery;

        // 4. Most Booked Resource
        let mbQuery = supabase.from('bookings').select('resource_id, resources!inner(department)');
        mbQuery = applyDeptFilter(mbQuery, department, 'resources');
        const { data: bookingData } = await mbQuery;
        
        let mostBookedResource = "N/A";
        if (bookingData && bookingData.length > 0) {
            const counts: Record<string, number> = {};
            bookingData.forEach((b: any) => counts[b.resource_id] = (counts[b.resource_id] || 0) + 1);
            const topEntry = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
            if (topEntry) {
                const { data: resData } = await supabase
                    .from('resources')
                    .select('name')
                    .eq('id', topEntry[0])
                    .single();
                if (resData) mostBookedResource = resData.name;
            }
        }

        const utilization = totalResources ? Math.round(((activeBookings || 0) / totalResources) * 100) : 0;

        res.json({
            status: "success",
            data: {
                totalResources: totalResources || 0,
                activeBookings: activeBookings || 0,
                completedBookings: completedBookings || 0,
                resourcesUnderMaintenance: resourcesUnderMaintenance || 0,
                mostBookedResource,
                totalMaintenanceTickets: totalMaintenanceTickets || 0,
                pendingMaintenanceTasks: pendingMaintenanceTasks || 0,
                resourceUtilization: utilization
            }
        });
    } catch (error: any) {
        console.error("Overview Analytics Error:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * GET /api/admin/analytics/bookings
 * Booking trends and status distribution
 */
export const getBookingAnalytics = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        const department = req.query.department as string;

        // Booking status distribution
        let statusQuery = supabase
            .from('bookings')
            .select('status, resources!inner(department)');
        statusQuery = applyDeptFilter(statusQuery, department, 'resources');
        const { data: statusData } = await statusQuery;
        
        const statusDistribution: Record<string, number> = {
            'Pending': 0,
            'Approved': 0,
            'Completed': 0,
            'Cancelled': 0
        };
        statusData?.forEach((b: any) => {
            if (statusDistribution[b.status] !== undefined) {
                statusDistribution[b.status]++;
            }
        });

        // Booking trends over time (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        let trendQuery = supabase
            .from('bookings')
            .select('created_at, resources!inner(department)')
            .gte('created_at', sevenDaysAgo.toISOString());
        trendQuery = applyDeptFilter(trendQuery, department, 'resources');
        const { data: trendData } = await trendQuery;

        const trends: Record<string, number> = {};
        // Initialize last 7 days
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            trends[d.toISOString().split('T')[0]] = 0;
        }

        trendData?.forEach((b: any) => {
            const date = b.created_at.split('T')[0];
            if (trends[date] !== undefined) trends[date]++;
        });

        const sortedTrends = Object.entries(trends)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, count]) => ({ date, count }));

        res.json({
            status: "success",
            data: {
                statusDistribution,
                trends: sortedTrends
            }
        });
    } catch (error: any) {
        console.error("Booking Analytics Error:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * GET /api/admin/analytics/resources
 * Resource usage by category and top resources
 */
export const getResourceAnalytics = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        const department = req.query.department as string;

        // Resources by category
        let resQuery = supabase.from('resources').select('type');
        resQuery = applyDeptFilter(resQuery, department);
        const { data: resourceData } = await resQuery;
        
        const categoryDistribution: Record<string, number> = {};
        resourceData?.forEach((r: any) => {
            categoryDistribution[r.type] = (categoryDistribution[r.type] || 0) + 1;
        });

        // Top 5 most booked resources
        let bkQuery = supabase.from('bookings').select('resource_id, resources!inner(department)');
        bkQuery = applyDeptFilter(bkQuery, department, 'resources');
        const { data: bookingData } = await bkQuery;
        
        const counts: Record<string, number> = {};
        bookingData?.forEach((b: any) => counts[b.resource_id] = (counts[b.resource_id] || 0) + 1);
        
        const top5Ids = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const topResources = await Promise.all(top5Ids.map(async ([id, count]) => {
            const { data } = await supabase.from('resources').select('name').eq('id', id).single();
            return { name: data?.name || "Unknown", count };
        }));

        res.json({
            status: "success",
            data: {
                categoryDistribution,
                topResources
            }
        });
    } catch (error: any) {
        console.error("Resource Analytics Error:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * GET /api/admin/analytics/maintenance
 * Maintenance ticket stats
 */
export const getMaintenanceAnalytics = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        const department = req.query.department as string;

        let mtQuery = supabase
            .from('maintenance_tickets')
            .select('status, created_at, completed_at, resource_id, resources!inner(department)');
        mtQuery = applyDeptFilter(mtQuery, department, 'resources');
        const { data: ticketData } = await mtQuery;

        const statusDistribution: Record<string, number> = {
            'OPEN': 0,
            'IN_PROGRESS': 0,
            'COMPLETED': 0
        };
        
        let totalCompletionTimeMs = 0;
        let completedCount = 0;
        const resourceMaintenanceCounts: Record<string, number> = {};

        ticketData?.forEach((t: any) => {
            if (statusDistribution[t.status] !== undefined) {
                statusDistribution[t.status]++;
            }

            if (t.status === 'COMPLETED' && t.completed_at) {
                const start = new Date(t.created_at).getTime();
                const end = new Date(t.completed_at).getTime();
                totalCompletionTimeMs += (end - start);
                completedCount++;
            }

            resourceMaintenanceCounts[t.resource_id] = (resourceMaintenanceCounts[t.resource_id] || 0) + 1;
        });

        const avgCompletionTimeHours = completedCount > 0 
            ? Math.round((totalCompletionTimeMs / completedCount) / (1000 * 60 * 60)) 
            : 0;

        // Top maintained resources
        const topMaintainedIds = Object.entries(resourceMaintenanceCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        const topMaintainedResources = await Promise.all(topMaintainedIds.map(async ([id, count]) => {
            const { data } = await supabase.from('resources').select('name').eq('id', id).single();
            return { name: data?.name || "Unknown", count };
        }));

        res.json({
            status: "success",
            data: {
                statusDistribution,
                avgCompletionTimeHours,
                topMaintainedResources
            }
        });
    } catch (error: any) {
        console.error("Maintenance Analytics Error:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * GET /api/admin/analytics/booking-trends
 * Returns booking trends by range (7d, 30d, 12m)
 */
export const getBookingTrends = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        const range = (req.query.range as string) || '7d';
        
        let startDate = new Date();
        let interval: 'day' | 'month' = 'day';

        if (range === '30d') {
            startDate.setDate(startDate.getDate() - 30);
            interval = 'day';
        } else if (range === '12m') {
            startDate.setFullYear(startDate.getFullYear() - 1);
            interval = 'month';
        } else {
            startDate.setDate(startDate.getDate() - 7);
            interval = 'day';
        }

        const { data, error } = await supabase
            .from('bookings')
            .select('created_at')
            .gte('created_at', startDate.toISOString());

        if (error) throw error;

        const trends: Record<string, number> = {};
        
        const getKey = (date: Date) => {
            if (interval === 'month') {
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            }
            return date.toISOString().split('T')[0];
        };

        // Pre-fill keys to ensure all dates are present
        let current = new Date(startDate);
        const now = new Date();
        while (current <= now) {
            trends[getKey(current)] = 0;
            if (interval === 'month') {
                current.setMonth(current.getMonth() + 1);
            } else {
                current.setDate(current.getDate() + 1);
            }
        }

        data?.forEach((b: any) => {
            const key = getKey(new Date(b.created_at));
            if (trends[key] !== undefined) trends[key]++;
        });

        const result = Object.entries(trends)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([label, value]) => ({ label, value }));

        res.json({ status: "success", data: result });
    } catch (error: any) {
        console.error("Booking Trends Error:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * GET /api/admin/analytics/booking-status
 * Returns detailed status distribution
 */
export const getBookingStatus = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        const { data, error } = await supabase.from('bookings').select('status');
        
        if (error) throw error;

        const counts: Record<string, number> = {
            'Pending': 0,
            'Approved': 0,
            'Completed': 0,
            'Cancelled': 0,
            'Rejected': 0
        };

        data?.forEach((b: any) => {
            if (counts[b.status] !== undefined) counts[b.status]++;
        });

        res.json({ status: "success", data: counts });
    } catch (error: any) {
        console.error("Booking Status Error:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * GET /api/admin/analytics/resource-bookings
 * Returns top 10 most booked resources
 */
export const getResourceBookings = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        const department = req.query.department as string;

        let bkQuery = supabase.from('bookings').select('resource_id, resources!inner(department)');
        bkQuery = applyDeptFilter(bkQuery, department, 'resources');
        const { data, error } = await bkQuery;
        
        if (error) throw error;

        const counts: Record<string, number> = {};
        data?.forEach((b: any) => {
            counts[b.resource_id] = (counts[b.resource_id] || 0) + 1;
        });
        
        const sorted = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const result = await Promise.all(sorted.map(async ([id, count]) => {
            const { data: resData } = await supabase
                .from('resources')
                .select('name')
                .eq('id', id)
                .single();
            return { name: resData?.name || "Unknown Resource", count };
        }));

        res.json({ status: "success", data: result });
    } catch (error: any) {
        console.error("Resource Bookings Error:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * GET /api/admin/analytics/category-bookings
 * Returns booking distribution by resource category
 */
export const getCategoryBookings = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        const department = req.query.department as string;
        
        let bkQuery = supabase
            .from('bookings')
            .select('resource_id, resources!inner(type, department)');
        bkQuery = applyDeptFilter(bkQuery, department, 'resources');
        const { data, error } = await bkQuery;

        if (error) throw error;

        const counts: Record<string, number> = {};
        data?.forEach((b: any) => {
            const type = (b.resources as any)?.type || 'Other';
            counts[type] = (counts[type] || 0) + 1;
        });

        res.json({ status: "success", data: counts });
    } catch (error: any) {
        console.error("Category Bookings Error:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * GET /api/admin/analytics/resource-utilization
 * Returns detailed utilization metrics for all resources
 */
export const getResourceUtilization = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        const range = (req.query.range as string) || '30d';
        
        let days = 30;
        if (range === '7d') days = 7;
        else if (range === '12m') days = 365;

        const department = req.query.department as string;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Fetch resources
        let resQuery = supabase.from('resources').select('id, name, type');
        resQuery = applyDeptFilter(resQuery, department);
        const { data: resources, error: resError } = await resQuery;
        
        if (resError) throw resError;

        // Fetch approved/completed bookings for these resources in range
        let bkQuery = supabase
            .from('bookings')
            .select('resource_id, start_time, end_time, resources!inner(department)')
            .in('status', ['Approved', 'Completed'])
            .gte('start_time', startDate.toISOString());
        bkQuery = applyDeptFilter(bkQuery, department, 'resources');
        const { data: bookings, error: bkError } = await bkQuery;

        if (bkError) throw bkError;

        const totalAvailableHours = days * 24;
        
        const utilizationMap: Record<string, any> = {};
        resources?.forEach((r: any) => {
            utilizationMap[r.id] = {
                id: r.id,
                name: r.name,
                type: r.type,
                totalBookings: 0,
                totalHours: 0,
                utilizationRate: 0
            };
        });

        bookings?.forEach((b: any) => {
            if (utilizationMap[b.resource_id]) {
                const start = new Date(b.start_time);
                const end = new Date(b.end_time);
                const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                
                utilizationMap[b.resource_id].totalBookings++;
                utilizationMap[b.resource_id].totalHours += Math.max(0, durationHours);
            }
        });

        const result = Object.values(utilizationMap).map((item: any) => {
            item.utilizationRate = Math.min(100, Math.round((item.totalHours / totalAvailableHours) * 100));
            item.totalHours = Math.round(item.totalHours * 10) / 10; // Round to 1 decimal
            return item;
        }).sort((a, b) => b.utilizationRate - a.utilizationRate);

        res.json({ status: "success", data: result });
    } catch (error: any) {
        console.error("Resource Utilization Error:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * GET /api/admin/analytics/peak-usage
 * Returns peak hours and peak days distribution
 */
export const getPeakUsage = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        
        const department = req.query.department as string;
        
        let bkQuery = supabase
            .from('bookings')
            .select('start_time, resources!inner(department)')
            .in('status', ['Approved', 'Completed']);
        
        bkQuery = applyDeptFilter(bkQuery, department, 'resources');
        const { data, error } = await bkQuery;

        if (error) {
            console.error("Peak Usage Supabase Error:", error);
            throw error;
        }

        const hourDistribution: Record<number, number> = {};
        const dayDistribution: Record<number, number> = {};

        // Initialize
        for (let i = 0; i < 24; i++) hourDistribution[i] = 0;
        for (let i = 0; i < 7; i++) dayDistribution[i] = 0;

        data?.forEach((b: any) => {
            const date = new Date(b.start_time);
            const hour = date.getHours();
            const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

            hourDistribution[hour]++;
            dayDistribution[day]++;
        });

        const hours = Object.entries(hourDistribution).map(([h, count]) => ({
            hour: parseInt(h),
            label: `${h}:00`,
            count
        }));

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayStats = Object.entries(dayDistribution).map(([d, count]) => ({
            day: parseInt(d),
            label: days[parseInt(d)],
            count
        }));

        res.json({ 
            status: "success", 
            data: { 
                peakHours: hours, 
                peakDays: dayStats 
            } 
        });
    } catch (error: any) {
        console.error("Peak Usage Error:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};


/**
 * GET /api/admin/analytics/export/pdf
 */
export const exportAnalyticsPDF = async (req: AuthRequest, res: Response) => {
    try {
        const type = (req.query.type as string) || 'overview';
        const range = (req.query.range as string) || '7d';
        const supabase = req.supabase;
        const now = new Date().toISOString();

        if (type === 'overview') {
            // Re-use logic from getOverviewAnalytics
            const department = req.query.department as string;

            let resQuery = supabase.from('resources').select('*', { count: 'exact', head: true });
            resQuery = applyDeptFilter(resQuery, department);
            const { count: totalResources } = await resQuery;

            let bkQuery = supabase.from('bookings').select('*, resources!inner(department)', { count: 'exact', head: true }).eq('status', 'Approved').gt('end_time', now);
            bkQuery = applyDeptFilter(bkQuery, department, 'resources');
            const { count: activeBookings } = await bkQuery;

            let mtQuery = supabase.from('maintenance_tickets').select('*, resources!inner(department)', { count: 'exact', head: true }).in('status', ['OPEN', 'IN_PROGRESS']);
            mtQuery = applyDeptFilter(mtQuery, department, 'resources');
            const { count: pendingMaintenance } = await mtQuery;
            
            const utilization = totalResources ? Math.round(((activeBookings || 0) / totalResources) * 100) : 0;

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="urms-overview-report.pdf"');

            generatePDFReport(res, {
                title: 'URMS System Overview Report',
                subtitle: department ? `Department: ${department}` : 'Generated from Analytics Dashboard',
                summaryItems: [
                    { label: 'Total Resources', value: totalResources || 0 },
                    { label: 'Active Bookings', value: activeBookings || 0 },
                    { label: 'Pending Maintenance', value: pendingMaintenance || 0 },
                    { label: 'Overall Utilization', value: `${utilization}%` }
                ],
                sections: [
                    {
                        title: 'Quick Summary',
                        headers: ['Metric', 'Current Value'],
                        rows: [
                            ['Total Resources', totalResources || 0],
                            ['Active Bookings', activeBookings || 0],
                            ['Maintenance Tasks', pendingMaintenance || 0],
                            ['Resource Utilization', `${utilization}%`]
                        ]
                    }
                ]
            });
        } else if (type === 'bookings') {
            // Booking statistics
            const department = req.query.department as string;

            let stQuery = supabase.from('bookings').select('status, resources!inner(department)');
            stQuery = applyDeptFilter(stQuery, department, 'resources');
            const { data: statusData } = await stQuery;

            const counts: Record<string, number> = { 'Pending': 0, 'Approved': 0, 'Completed': 0, 'Cancelled': 0, 'Rejected': 0 };
            statusData?.forEach((b: any) => { if (counts[b.status] !== undefined) counts[b.status]++; });

            let bkQuery = supabase.from('bookings').select('resource_id, resources!inner(department)');
            bkQuery = applyDeptFilter(bkQuery, department, 'resources');
            const { data: rfRes } = await bkQuery;

            const resCounts: Record<string, number> = {};
            rfRes?.forEach((b: any) => resCounts[b.resource_id] = (resCounts[b.resource_id] || 0) + 1);
            const sortedRes = Object.entries(resCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
            
            const topResources = await Promise.all(sortedRes.map(async ([id, count]) => {
                const { data } = await supabase.from('resources').select('name').eq('id', id).single();
                return [data?.name || 'Unknown', count];
            }));

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="urms-bookings-report.pdf"');

            generatePDFReport(res, {
                title: 'URMS Booking Statistics Report',
                subtitle: department ? `Department: ${department}` : `Booking metrics and distribution (${range})`,
                sections: [
                    {
                        title: 'Booking Status Distribution',
                        headers: ['Status', 'Count'],
                        rows: Object.entries(counts)
                    },
                    {
                        title: 'Top 10 Booked Resources',
                        headers: ['Resource Name', 'Total Bookings'],
                        rows: topResources
                    }
                ]
            });
        } else if (type === 'utilization') {
            // Utilization Report
            const department = req.query.department as string;

            let resQuery = supabase.from('resources').select('id, name, type');
            resQuery = applyDeptFilter(resQuery, department);
            const { data: resources } = await resQuery;

            let bkQuery = supabase.from('bookings').select('resource_id, start_time, end_time, resources!inner(department)').in('status', ['Approved', 'Completed']);
            bkQuery = applyDeptFilter(bkQuery, department, 'resources');
            const { data: bookings } = await bkQuery;
            
            const utilizationMap: Record<string, any> = {};
            resources?.forEach((r: any) => {
                utilizationMap[r.id] = { name: r.name, type: r.type, bookings: 0, hours: 0 };
            });

            bookings?.forEach((b: any) => {
                if (utilizationMap[b.resource_id]) {
                    const start = new Date(b.start_time);
                    const end = new Date(b.end_time);
                    utilizationMap[b.resource_id].bookings++;
                    utilizationMap[b.resource_id].hours += Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
                }
            });

            const rows = Object.values(utilizationMap).map((item: any) => [
                item.name,
                item.type,
                item.bookings,
                `${Math.round(item.hours * 10) / 10}h`
            ]).sort((a: any, b: any) => b[2] - a[2]);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="urms-utilization-report.pdf"');

            generatePDFReport(res, {
                title: 'Resource Utilization Report',
                subtitle: 'Asset efficiency and usage statistics',
                sections: [
                    {
                        title: 'Detailed Resource Usage',
                        headers: ['Resource', 'Category', 'Total Bookings', 'Hours Used'],
                        rows: rows
                    }
                ]
            });
        } else {
            res.status(400).json({ status: "error", message: "Invalid report type" });
        }
    } catch (error: any) {
        console.error("PDF Export Error:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * GET /api/admin/analytics/export/excel
 */
export const exportAnalyticsExcel = async (req: AuthRequest, res: Response) => {
    try {
        const type = (req.query.type as string) || 'overview';
        const supabase = req.supabase;
        const now = new Date().toISOString();

        if (type === 'overview') {
            const department = req.query.department as string;

            let resQuery = supabase.from('resources').select('*', { count: 'exact', head: true });
            resQuery = applyDeptFilter(resQuery, department);
            const { count: totalResources } = await resQuery;

            let bkQuery = supabase.from('bookings').select('*, resources!inner(department)', { count: 'exact', head: true }).eq('status', 'Approved').gt('end_time', now);
            bkQuery = applyDeptFilter(bkQuery, department, 'resources');
            const { count: activeBookings } = await bkQuery;

            let mtQuery = supabase.from('maintenance_tickets').select('*, resources!inner(department)', { count: 'exact', head: true }).in('status', ['OPEN', 'IN_PROGRESS']);
            mtQuery = applyDeptFilter(mtQuery, department, 'resources');
            const { count: pendingMaintenance } = await mtQuery;
            
            generateExcelReport(res, 'urms-overview.xlsx', [
                {
                    name: 'Summary',
                    data: [
                        { Metric: 'Total Resources', Value: totalResources || 0 },
                        { Metric: 'Active Bookings', Value: activeBookings || 0 },
                        { Metric: 'Pending Maintenance', Value: pendingMaintenance || 0 },
                        { Metric: 'Department', Value: department || 'All' },
                        { Metric: 'Report Date', Value: new Date().toLocaleString() }
                    ]
                }
            ]);
        } else if (type === 'bookings') {
            const department = req.query.department as string;

            let bkQuery = supabase
                .from('bookings')
                .select('id, resource_id, start_time, end_time, status, user_id, resources!inner(name, type, department)');
            bkQuery = applyDeptFilter(bkQuery, department, 'resources');
            const { data: bookings } = await bkQuery;

            const bookingData = bookings?.map((b: any) => ({
                'Booking ID': b.id,
                'Resource': b.resources?.name || 'Unknown',
                'Category': b.resources?.type || 'N/A',
                'Start': new Date(b.start_time).toLocaleString(),
                'End': new Date(b.end_time).toLocaleString(),
                'Status': b.status,
                'User ID': b.user_id
            })) || [];

            generateExcelReport(res, 'urms-bookings.xlsx', [
                { name: 'Bookings', data: bookingData }
            ]);
        } else if (type === 'utilization') {
            const department = req.query.department as string;

            let resQuery = supabase.from('resources').select('id, name, type');
            resQuery = applyDeptFilter(resQuery, department);
            const { data: resources } = await resQuery;

            let bkQuery = supabase.from('bookings').select('resource_id, start_time, end_time, resources!inner(department)').in('status', ['Approved', 'Completed']);
            bkQuery = applyDeptFilter(bkQuery, department, 'resources');
            const { data: bookings } = await bkQuery;
            
            const utilizationMap: Record<string, any> = {};
            resources?.forEach((r: any) => {
                utilizationMap[r.id] = { Name: r.name, Category: r.type, 'Total Bookings': 0, 'Total Hours': 0 };
            });

            bookings?.forEach((b: any) => {
                if (utilizationMap[b.resource_id]) {
                    const start = new Date(b.start_time);
                    const end = new Date(b.end_time);
                    utilizationMap[b.resource_id]['Total Bookings']++;
                    utilizationMap[b.resource_id]['Total Hours'] += Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
                }
            });

            const data = Object.values(utilizationMap).map((item: any) => ({
                ...item,
                'Total Hours': Math.round(item['Total Hours'] * 10) / 10
            }));

            generateExcelReport(res, 'urms-utilization.xlsx', [
                { name: 'Utilization', data: data }
            ]);
        } else {
            res.status(400).json({ status: "error", message: "Invalid report type" });
        }
    } catch (error: any) {
        console.error("Excel Export Error:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};
