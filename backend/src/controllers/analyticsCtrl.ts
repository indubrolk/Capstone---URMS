import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * GET /api/admin/analytics/overview
 * High-level summary metrics
 */
export const getOverviewAnalytics = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        const now = new Date().toISOString();

        // 1. Resource Counts
        const { count: totalResources } = await supabase
            .from('resources')
            .select('*', { count: 'exact', head: true });

        const { count: resourcesUnderMaintenance } = await supabase
            .from('resources')
            .select('*', { count: 'exact', head: true })
            .eq('availability_status', 'Maintenance');

        // 2. Booking Counts
        const { count: activeBookings } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Approved')
            .gt('end_time', now);

        const { count: completedBookings } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Completed');

        // 3. Maintenance Counts
        const { count: totalMaintenanceTickets } = await supabase
            .from('maintenance_tickets')
            .select('*', { count: 'exact', head: true });

        const { count: pendingMaintenanceTasks } = await supabase
            .from('maintenance_tickets')
            .select('*', { count: 'exact', head: true })
            .in('status', ['OPEN', 'IN_PROGRESS']);

        // 4. Most Booked Resource
        const { data: bookingData } = await supabase
            .from('bookings')
            .select('resource_id');
        
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

        // Booking status distribution
        const { data: statusData } = await supabase
            .from('bookings')
            .select('status');
        
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
        
        const { data: trendData } = await supabase
            .from('bookings')
            .select('created_at')
            .gte('created_at', sevenDaysAgo.toISOString());

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

        // Resources by category
        const { data: resourceData } = await supabase
            .from('resources')
            .select('type');
        
        const categoryDistribution: Record<string, number> = {};
        resourceData?.forEach((r: any) => {
            categoryDistribution[r.type] = (categoryDistribution[r.type] || 0) + 1;
        });

        // Top 5 most booked resources
        const { data: bookingData } = await supabase
            .from('bookings')
            .select('resource_id');
        
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

        const { data: ticketData } = await supabase
            .from('maintenance_tickets')
            .select('status, created_at, completed_at, resource_id');

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
