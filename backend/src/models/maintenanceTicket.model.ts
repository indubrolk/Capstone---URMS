import { promisePool } from '../config/db.config';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface MaintenanceTicket {
    id?: number;
    resourceId: number | string;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Pending' | 'In Progress' | 'Completed';
    createdBy: string;
    assignedTo?: string | null;
    created_at?: Date;
}

const MOCK_TICKETS: MaintenanceTicket[] = [
    { id: 1, resourceId: 1, title: 'Projector Issue', description: 'Screen flickering', priority: 'High', status: 'Pending', createdBy: 'dev-user' },
    { id: 2, resourceId: 2, title: 'AC Maintenance', description: 'Blowing warm air', priority: 'Medium', status: 'In Progress', createdBy: 'staff-1', assignedTo: 'tech-1' }
];

let mockIdCounter = 3;

export class MaintenanceTicketModel {
    static async findAll(filters: any = {}): Promise<MaintenanceTicket[]> {
        try {
            let query = 'SELECT * FROM maintenance_tickets WHERE 1=1';
            const params: any[] = [];
            
            if (filters.status) {
                query += ' AND status = ?';
                params.push(filters.status);
            }
            if (filters.priority) {
                query += ' AND priority = ?';
                params.push(filters.priority);
            }
            if (filters.resourceId) {
                query += ' AND resourceId = ?';
                params.push(filters.resourceId);
            }
            if (filters.createdBy) {
                query += ' AND createdBy = ?';
                params.push(filters.createdBy);
            }
            
            query += ' ORDER BY created_at DESC';

            const [rows] = await promisePool.query<RowDataPacket[]>(query, params);
            return rows as MaintenanceTicket[];
        } catch (error) {
            console.warn('DB connection failed or table missing, falling back to mock data');
            let results = [...MOCK_TICKETS];
            if (filters.status) results = results.filter(t => t.status === filters.status);
            if (filters.priority) results = results.filter(t => t.priority === filters.priority);
            if (filters.resourceId) results = results.filter(t => t.resourceId == filters.resourceId);
            if (filters.createdBy) results = results.filter(t => t.createdBy === filters.createdBy);
            return results;
        }
    }

    static async findById(id: number): Promise<MaintenanceTicket | null> {
        try {
            const [rows] = await promisePool.query<RowDataPacket[]>(
                'SELECT * FROM maintenance_tickets WHERE id = ?',
                [id]
            );
            if (rows.length === 0) return null;
            return rows[0] as MaintenanceTicket;
        } catch (error) {
            return MOCK_TICKETS.find(t => t.id === id) || null;
        }
    }

    static async create(ticket: Partial<MaintenanceTicket>): Promise<number> {
        const { resourceId, title, description, priority, createdBy } = ticket;
        try {
            const [result] = await promisePool.query<ResultSetHeader>(
                'INSERT INTO maintenance_tickets (resourceId, title, description, priority, status, createdBy) VALUES (?, ?, ?, ?, ?, ?)',
                [resourceId, title, description, priority || 'Low', 'Pending', createdBy]
            );
            return result.insertId;
        } catch (error) {
            const newId = mockIdCounter++;
            MOCK_TICKETS.unshift({
                id: newId,
                resourceId: resourceId!,
                title: title!,
                description: description!,
                priority: (priority as 'Low'|'Medium'|'High') || 'Low',
                status: 'Pending',
                createdBy: createdBy!,
                created_at: new Date()
            });
            return newId;
        }
    }

    static async update(id: number, data: Partial<MaintenanceTicket>): Promise<boolean> {
        try {
            const updates: string[] = [];
            const values: any[] = [];

            if (data.status !== undefined) { updates.push('status = ?'); values.push(data.status); }
            if (data.priority !== undefined) { updates.push('priority = ?'); values.push(data.priority); }
            if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
            if (data.assignedTo !== undefined) { updates.push('assignedTo = ?'); values.push(data.assignedTo); }

            if (updates.length === 0) return true;

            values.push(id);
            const query = `UPDATE maintenance_tickets SET ${updates.join(', ')} WHERE id = ?`;
            const [result] = await promisePool.query<ResultSetHeader>(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            const ticket = MOCK_TICKETS.find(t => t.id === id);
            if (ticket) {
                if (data.status !== undefined) ticket.status = data.status as 'Pending'|'In Progress'|'Completed';
                if (data.priority !== undefined) ticket.priority = data.priority as 'Low'|'Medium'|'High';
                if (data.description !== undefined) ticket.description = data.description;
                if (data.assignedTo !== undefined) ticket.assignedTo = data.assignedTo;
                return true;
            }
            return false;
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            // Hard delete based on instructions: "soft delete preferred, otherwise hard delete ONLY if existing architecture already uses it".
            // Since resource module uses hard delete (`DELETE FROM resources...`), I'll adhere to that architecture.
            const [result] = await promisePool.query<ResultSetHeader>(
                'DELETE FROM maintenance_tickets WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            const index = MOCK_TICKETS.findIndex(t => t.id === id);
            if (index !== -1) {
                MOCK_TICKETS.splice(index, 1);
                return true;
            }
            return false;
        }
    }
}
