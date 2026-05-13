import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * GET /api/admin/reports/schedules
 */
export const getSchedules = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        const { data, error } = await supabase
            .from('report_schedules')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ status: "success", data });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * POST /api/admin/reports/schedules
 */
export const createSchedule = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        const { report_types, recipients, delivery_day, delivery_time, format, is_enabled } = req.body;

        const { data, error } = await supabase
            .from('report_schedules')
            .insert([{
                report_types,
                recipients,
                delivery_day,
                delivery_time,
                format,
                is_enabled: is_enabled ?? true
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ status: "success", data });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * PATCH /api/admin/reports/schedules/:id
 */
export const updateSchedule = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        const { id } = req.params;
        const updates = req.body;
        
        updates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('report_schedules')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json({ status: "success", data });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

/**
 * DELETE /api/admin/reports/schedules/:id
 */
export const deleteSchedule = async (req: AuthRequest, res: Response) => {
    try {
        const supabase = req.supabase;
        const { id } = req.params;

        const { error } = await supabase
            .from('report_schedules')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ status: "success", message: "Schedule deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
