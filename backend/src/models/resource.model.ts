/**
 * resource.model.ts
 * ─────────────────────────────────────────────────────────────
 * Data-access layer for the `resources` table in Supabase.
 * Replaces all previous mysql2 / promisePool queries.
 *
 * Table schema (Supabase / PostgreSQL):
 *   id                  uuid  PK default gen_random_uuid()
 *   name                text  NOT NULL
 *   type                text  NOT NULL  default 'Lecture Halls'
 *   capacity            text  NOT NULL  default '0'
 *   location            text  NOT NULL
 *   availability_status text  NOT NULL  default 'Available'
 *   equipment           text            (stored as JSON string)
 *   created_at          timestamptz     default now()
 * ─────────────────────────────────────────────────────────────
 */
import supabase from '../config/supabaseClient';

export interface Resource {
    id?: string;           // uuid in Supabase (was number in MySQL)
    name: string;
    type: string;
    capacity: string;
    location: string;
    availability_status: string;
    equipment?: string[];
    created_at?: Date;
}

// ─── Fallback mock data (used when Supabase is unreachable) ───
const MOCK_RESOURCES: Resource[] = [
    { id: '1', name: 'Main Auditorium',       type: 'Lecture Halls', capacity: '500', location: 'Block A',       availability_status: 'Available' },
    { id: '2', name: 'Mini Auditorium',       type: 'Lecture Halls', capacity: '250', location: 'Block B',       availability_status: 'Booked' },
    { id: '3', name: 'Z9 Hall',               type: 'Lecture Halls', capacity: '50',  location: 'Block Z',       availability_status: 'Available' },
    { id: '4', name: 'Computer Lab',          type: 'Labs',          capacity: '50',  location: 'IT Building',   availability_status: 'Maintenance' },
    { id: '5', name: 'Multimedia Projectors', type: 'Equipment',     capacity: '5',   location: 'IT Helpdesk',   availability_status: 'Available' },
    { id: '6', name: 'Faculty Vehicle - Van', type: 'Vehicles',      capacity: '14',  location: 'Transport Pool', availability_status: 'Booked' }
];

// ─── Helpers ──────────────────────────────────────────────────
function parseEquipment(raw: any): string[] {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
        return JSON.parse(raw);
    } catch {
        return (raw as string).split(',').map((s: string) => s.trim());
    }
}

function toRow(resource: Partial<Resource>): Record<string, any> {
    const row: Record<string, any> = {};
    if (resource.name               !== undefined) row.name               = resource.name;
    if (resource.type               !== undefined) row.type               = resource.type;
    if (resource.capacity           !== undefined) row.capacity           = String(resource.capacity);
    if (resource.location           !== undefined) row.location           = resource.location;
    if (resource.availability_status !== undefined) row.availability_status = resource.availability_status;
    if (resource.equipment          !== undefined) row.equipment          = JSON.stringify(resource.equipment);
    return row;
}

// ─── Model ────────────────────────────────────────────────────
export class ResourceModel {

    // ── findAll ─────────────────────────────────────────────
    static async findAll(): Promise<Resource[]> {
        try {
            const { data, error } = await supabase
                .from('resources')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('⚠️  Supabase query failed in ResourceModel.findAll:', error.message);
                return MOCK_RESOURCES;
            }

            return (data as any[]).map(row => ({
                ...row,
                equipment: parseEquipment(row.equipment)
            })) as Resource[];
        } catch (err) {
            console.warn('⚠️  Supabase unreachable, using mock data');
            return MOCK_RESOURCES;
        }
    }

    // ── findById ────────────────────────────────────────────
    static async findById(id: string | number): Promise<Resource | null> {
        try {
            const { data, error } = await supabase
                .from('resources')
                .select('*')
                .eq('id', String(id))
                .maybeSingle();

            if (error) {
                console.warn('⚠️  Supabase query failed in ResourceModel.findById:', error.message);
                return MOCK_RESOURCES.find(r => r.id === String(id)) || null;
            }

            if (!data) return null;
            return { ...data, equipment: parseEquipment(data.equipment) } as Resource;
        } catch (err) {
            return MOCK_RESOURCES.find(r => r.id === String(id)) || null;
        }
    }

    // ── create ──────────────────────────────────────────────
    static async create(resource: Partial<Resource>): Promise<string> {
        try {
            const row = toRow({
                ...resource,
                availability_status: resource.availability_status || 'Available'
            });

            const { data, error } = await supabase
                .from('resources')
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
            MOCK_RESOURCES.unshift({
                id: newId,
                name: resource.name!,
                type: resource.type!,
                capacity: resource.capacity!,
                location: resource.location!,
                availability_status: resource.availability_status || 'Available',
                equipment: resource.equipment || [],
            });
            return newId;
        }
    }

    // ── update ──────────────────────────────────────────────
    static async update(id: string | number, data: Partial<Resource>): Promise<boolean> {
        try {
            const row = toRow(data);
            if (Object.keys(row).length === 0) return true;

            const { error } = await supabase
                .from('resources')
                .update(row)
                .eq('id', String(id));

            if (error) {
                console.warn('⚠️  Supabase update failed:', error.message);
                throw new Error(error.message);
            }

            return true;
        } catch (err) {
            // Mock fallback
            const resource = MOCK_RESOURCES.find(r => r.id === String(id));
            if (resource) {
                if (data.name               !== undefined) resource.name               = data.name;
                if (data.type               !== undefined) resource.type               = data.type;
                if (data.capacity           !== undefined) resource.capacity           = String(data.capacity);
                if (data.location           !== undefined) resource.location           = data.location;
                if (data.availability_status !== undefined) resource.availability_status = data.availability_status;
                if (data.equipment          !== undefined) resource.equipment          = data.equipment;
                return true;
            }
            return false;
        }
    }

    // ── delete ──────────────────────────────────────────────
    static async delete(id: string | number): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('resources')
                .delete()
                .eq('id', String(id));

            if (error) {
                console.warn('⚠️  Supabase delete failed:', error.message);
                throw new Error(error.message);
            }

            return true;
        } catch (err) {
            // Mock fallback
            const index = MOCK_RESOURCES.findIndex(r => r.id === String(id));
            if (index !== -1) {
                MOCK_RESOURCES.splice(index, 1);
                return true;
            }
            return false;
        }
    }

    // ── checkActiveBookings ─────────────────────────────────
    static async checkActiveBookings(id: string | number): Promise<boolean> {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('id')
                .eq('resource_id', String(id))
                .eq('status', 'Approved')
                .gt('end_time', new Date().toISOString())
                .limit(1);

            if (error) return false;
            return (data?.length ?? 0) > 0;
        } catch {
            return false;
        }
    }
}
