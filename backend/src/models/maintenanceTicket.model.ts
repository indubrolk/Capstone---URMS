/**
 * maintenanceTicket.model.ts
 * ─────────────────────────────────────────────────────────────
 * Data-access layer for the `maintenance_tickets` table.
 * Replaces all previous mysql2 / promisePool queries with
 * Supabase client calls.
 *
 * Table schema (Supabase / PostgreSQL):
 *   id           uuid  PK default gen_random_uuid()
 *   resource_id  uuid  FK → resources(id) ON DELETE CASCADE
 *   title        text  NOT NULL
 *   description  text
 *   priority     text  check in ('Low','Medium','High')  default 'Low'
 *   status       text  check in ('OPEN','IN_PROGRESS','COMPLETED') default 'OPEN'
 *   created_by   text  NOT NULL    (Firebase UID of reporter)
 *   assigned_to  text              (Firebase UID of technician)
 *   created_at   timestamptz       default now()
 *   completed_at timestamptz
 *   outcome      text  check in ('Fixed','Faulty','Decommissioned')
 * ─────────────────────────────────────────────────────────────
 * NOTE: Column names use snake_case in PostgreSQL. The model
 * maps them to/from the camelCase interface used throughout
 * the rest of the backend to preserve the existing API contract.
 * ─────────────────────────────────────────────────────────────
 */
import supabase from '../config/supabaseClient';

export interface MaintenanceTicket {
    id?: string;           // uuid (was number)
    resourceId: string;    // maps to resource_id column
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
    createdBy: string;     // maps to created_by column
    assignedTo?: string | null;
    created_at?: Date;
    completed_at?: Date | null;
    outcome?: 'Fixed' | 'Faulty' | 'Decommissioned' | null;
}

// ─── Fallback mock data ───────────────────────────────────────
const MOCK_TICKETS: MaintenanceTicket[] = [
    { id: '1', resourceId: '1', title: 'Projector Issue',  description: 'Screen flickering',  priority: 'High',   status: 'OPEN',        createdBy: 'dev-user' },
    { id: '2', resourceId: '2', title: 'AC Maintenance',   description: 'Blowing warm air',    priority: 'Medium', status: 'IN_PROGRESS', createdBy: 'staff-1', assignedTo: 'tech-1' }
];

// ─── Column mapping helpers ───────────────────────────────────
/** Convert a DB row (snake_case) → MaintenanceTicket (camelCase) */
function fromRow(row: any): MaintenanceTicket {
    return {
        id:           row.id,
        resourceId:   row.resource_id,
        title:        row.title,
        description:  row.description,
        priority:     row.priority,
        status:       row.status,
        createdBy:    row.created_by,
        assignedTo:   row.assigned_to ?? null,
        created_at:   row.created_at ? new Date(row.created_at) : undefined,
        completed_at: row.completed_at ? new Date(row.completed_at) : null,
        outcome:      row.outcome ?? null,
    };
}

/** Build a DB payload (snake_case) from a partial MaintenanceTicket */
function toRow(ticket: Partial<MaintenanceTicket>): Record<string, any> {
    const row: Record<string, any> = {};
    if (ticket.resourceId   !== undefined) row.resource_id   = String(ticket.resourceId);
    if (ticket.title        !== undefined) row.title         = ticket.title;
    if (ticket.description  !== undefined) row.description   = ticket.description;
    if (ticket.priority     !== undefined) row.priority      = ticket.priority;
    if (ticket.status       !== undefined) row.status        = ticket.status;
    if (ticket.createdBy    !== undefined) row.created_by    = ticket.createdBy;
    if (ticket.assignedTo   !== undefined) row.assigned_to   = ticket.assignedTo;
    if (ticket.completed_at !== undefined) row.completed_at  = ticket.completed_at;
    if (ticket.outcome      !== undefined) row.outcome       = ticket.outcome;
    return row;
}

// ─── Model ────────────────────────────────────────────────────
export class MaintenanceTicketModel {

    // ── findAll ─────────────────────────────────────────────
    static async findAll(filters: any = {}): Promise<MaintenanceTicket[]> {
        try {
            let query = supabase.from('maintenance_tickets').select('*');

            if (filters.status)     query = query.eq('status',      filters.status) as any;
            if (filters.priority)   query = query.eq('priority',    filters.priority) as any;
            if (filters.resourceId) query = query.eq('resource_id', String(filters.resourceId)) as any;
            if (filters.createdBy)  query = query.eq('created_by',  filters.createdBy) as any;
            if (filters.assignedTo) query = query.eq('assigned_to', filters.assignedTo) as any;

            query = query.order('created_at', { ascending: false }) as any;

            const { data, error } = await query;

            if (error) {
                console.warn('⚠️  Supabase query failed in MaintenanceTicketModel.findAll:', error.message);
                throw new Error(error.message);
            }

            return (data as any[]).map(fromRow);
        } catch (err) {
            console.warn('⚠️  DB connection failed or table missing, falling back to mock data');
            let results = [...MOCK_TICKETS];
            if (filters.status)     results = results.filter(t => t.status     === filters.status);
            if (filters.priority)   results = results.filter(t => t.priority   === filters.priority);
            if (filters.resourceId) results = results.filter(t => t.resourceId == filters.resourceId);
            if (filters.createdBy)  results = results.filter(t => t.createdBy  === filters.createdBy);
            if (filters.assignedTo) results = results.filter(t => t.assignedTo === filters.assignedTo);
            return results;
        }
    }

    // ── findById ────────────────────────────────────────────
    static async findById(id: string | number): Promise<MaintenanceTicket | null> {
        try {
            const { data, error } = await supabase
                .from('maintenance_tickets')
                .select('*')
                .eq('id', String(id))
                .maybeSingle();

            if (error) {
                console.warn('⚠️  Supabase query failed in MaintenanceTicketModel.findById:', error.message);
                return MOCK_TICKETS.find(t => t.id === String(id)) || null;
            }

            if (!data) return null;
            return fromRow(data);
        } catch {
            return MOCK_TICKETS.find(t => t.id === String(id)) || null;
        }
    }

    // ── create ──────────────────────────────────────────────
    static async create(ticket: Partial<MaintenanceTicket>): Promise<string> {
        try {
            const row = toRow({
                ...ticket,
                status:   'OPEN',
                priority: ticket.priority || 'Low'
            });

            const { data, error } = await supabase
                .from('maintenance_tickets')
                .insert(row)
                .select('id')
                .single();

            if (error || !data) {
                throw new Error(error?.message || 'Insert returned no data');
            }

            return (data as any).id as string;
        } catch (err: any) {
            // Mock fallback
            console.warn('⚠️  Supabase insert failed, using mock:', err.message);
            const newId = String(Date.now());
            MOCK_TICKETS.unshift({
                id:          newId,
                resourceId:  String(ticket.resourceId!),
                title:       ticket.title!,
                description: ticket.description!,
                priority:    (ticket.priority as 'Low' | 'Medium' | 'High') || 'Low',
                status:      'OPEN',
                createdBy:   ticket.createdBy!,
                created_at:  new Date()
            });
            return newId;
        }
    }

    // ── update ──────────────────────────────────────────────
    static async update(id: string | number, data: Partial<MaintenanceTicket>): Promise<boolean> {
        try {
            const row = toRow(data);
            if (Object.keys(row).length === 0) return true;

            const { error } = await supabase
                .from('maintenance_tickets')
                .update(row)
                .eq('id', String(id));

            if (error) {
                console.warn('⚠️  Supabase update failed:', error.message);
                throw new Error(error.message);
            }

            return true;
        } catch {
            // Mock fallback
            const ticket = MOCK_TICKETS.find(t => t.id === String(id));
            if (ticket) {
                if (data.status       !== undefined) ticket.status       = data.status as any;
                if (data.priority     !== undefined) ticket.priority     = data.priority as any;
                if (data.description  !== undefined) ticket.description  = data.description;
                if (data.assignedTo   !== undefined) ticket.assignedTo   = data.assignedTo;
                if (data.completed_at !== undefined) ticket.completed_at = data.completed_at;
                if (data.outcome      !== undefined) ticket.outcome      = data.outcome as any;
                return true;
            }
            return false;
        }
    }

    // ── delete ──────────────────────────────────────────────
    static async delete(id: string | number): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('maintenance_tickets')
                .delete()
                .eq('id', String(id));

            if (error) {
                console.warn('⚠️  Supabase delete failed:', error.message);
                throw new Error(error.message);
            }

            return true;
        } catch {
            // Mock fallback
            const index = MOCK_TICKETS.findIndex(t => t.id === String(id));
            if (index !== -1) {
                MOCK_TICKETS.splice(index, 1);
                return true;
            }
            return false;
        }
    }
}
