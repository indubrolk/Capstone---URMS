import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Helper to apply department filtering to Supabase queries
 */
export const applyDeptFilter = (query: any, department: string | undefined, joinPath?: string) => {
    if (!department) return query;
    if (joinPath) {
        return query.eq(`${joinPath}.department`, department);
    }
    return query.eq('department', department);
};

/**
 * Helper to apply date range filtering to Supabase queries
 */
export const applyDateRangeFilter = (query: any, startDate: string | undefined, endDate: string | undefined, column = 'created_at') => {
    if (startDate) {
        query = query.gte(column, startDate);
    }
    if (endDate) {
        // Append end of day if only date is provided
        const end = endDate.includes('T') ? endDate : `${endDate}T23:59:59.999Z`;
        query = query.lte(column, end);
    }
    return query;
};

export const getOverviewData = async (supabase: SupabaseClient, params: { department?: string; startDate?: string; endDate?: string }) => {
    const now = new Date().toISOString();
    const { department, startDate, endDate } = params;

    let resQuery = supabase.from('resources').select('*', { count: 'exact', head: true });
    resQuery = applyDeptFilter(resQuery, department);
    const { count: totalResources } = await resQuery;

    let maintQuery = supabase.from('resources').select('*', { count: 'exact', head: true }).eq('availability_status', 'Maintenance');
    maintQuery = applyDeptFilter(maintQuery, department);
    const { count: resourcesUnderMaintenance } = await maintQuery;

    let activeBookingsQuery = supabase
        .from('bookings')
        .select('*, resources!inner(department)', { count: 'exact', head: true })
        .eq('status', 'Approved')
        .gt('end_time', now);
    activeBookingsQuery = applyDeptFilter(activeBookingsQuery, department, 'resources');
    activeBookingsQuery = applyDateRangeFilter(activeBookingsQuery, startDate, endDate);
    const { count: activeBookings } = await activeBookingsQuery;

    let completedBookingsQuery = supabase
        .from('bookings')
        .select('*, resources!inner(department)', { count: 'exact', head: true })
        .eq('status', 'Completed');
    completedBookingsQuery = applyDeptFilter(completedBookingsQuery, department, 'resources');
    completedBookingsQuery = applyDateRangeFilter(completedBookingsQuery, startDate, endDate);
    const { count: completedBookings } = await completedBookingsQuery;

    let totalMaintQuery = supabase
        .from('maintenance_tickets')
        .select('*, resources!inner(department)', { count: 'exact', head: true });
    totalMaintQuery = applyDeptFilter(totalMaintQuery, department, 'resources');
    totalMaintQuery = applyDateRangeFilter(totalMaintQuery, startDate, endDate);
    const { count: totalMaintenanceTickets } = await totalMaintQuery;

    let pendingMaintQuery = supabase
        .from('maintenance_tickets')
        .select('*, resources!inner(department)', { count: 'exact', head: true })
        .in('status', ['OPEN', 'IN_PROGRESS']);
    pendingMaintQuery = applyDeptFilter(pendingMaintQuery, department, 'resources');
    pendingMaintQuery = applyDateRangeFilter(pendingMaintQuery, startDate, endDate);
    const { count: pendingMaintenanceTasks } = await pendingMaintQuery;

    let mbQuery = supabase.from('bookings').select('resource_id, resources!inner(department)');
    mbQuery = applyDeptFilter(mbQuery, department, 'resources');
    mbQuery = applyDateRangeFilter(mbQuery, startDate, endDate);
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

    return {
        totalResources: totalResources || 0,
        activeBookings: activeBookings || 0,
        completedBookings: completedBookings || 0,
        resourcesUnderMaintenance: resourcesUnderMaintenance || 0,
        mostBookedResource,
        totalMaintenanceTickets: totalMaintenanceTickets || 0,
        pendingMaintenanceTasks: pendingMaintenanceTasks || 0,
        resourceUtilization: utilization
    };
};

export const getBookingData = async (supabase: SupabaseClient, params: { department?: string; startDate?: string; endDate?: string }) => {
    const { department, startDate, endDate } = params;

    let statusQuery = supabase
        .from('bookings')
        .select('status, resources!inner(department)');
    statusQuery = applyDeptFilter(statusQuery, department, 'resources');
    statusQuery = applyDateRangeFilter(statusQuery, startDate, endDate);
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

    let start = new Date();
    if (startDate) {
        start = new Date(startDate);
    } else {
        start.setDate(start.getDate() - 7);
    }
    
    let end = new Date();
    if (endDate) {
        end = new Date(endDate);
    }

    let trendQuery = supabase
        .from('bookings')
        .select('created_at, resources!inner(department)')
        .gte('created_at', start.toISOString());
    
    if (endDate) {
        trendQuery = trendQuery.lte('created_at', end.toISOString());
    }

    trendQuery = applyDeptFilter(trendQuery, department, 'resources');
    const { data: trendData } = await trendQuery;

    const trends: Record<string, number> = {};
    let current = new Date(start);
    while (current <= end) {
        trends[current.toISOString().split('T')[0]] = 0;
        current.setDate(current.getDate() + 1);
    }

    trendData?.forEach((b: any) => {
        const date = b.created_at.split('T')[0];
        if (trends[date] !== undefined) trends[date]++;
    });

    const sortedTrends = Object.entries(trends)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({ date, count }));

    return {
        statusDistribution,
        trends: sortedTrends
    };
};
