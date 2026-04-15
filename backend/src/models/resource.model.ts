import { promisePool } from '../config/db.config';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Resource {
    id?: number;
    name: string;
    category: string;
    capacity: string;
    location: string;
    status: string;
    equipment?: string[];
    created_at?: Date;
}

const MOCK_RESOURCES: Resource[] = [
    { id: 1, name: 'Main Auditorium', category: 'Lecture Halls', capacity: '500', location: 'Block A', status: 'Available' },
    { id: 2, name: 'Mini Auditorium', category: 'Lecture Halls', capacity: '250', location: 'Block B', status: 'Booked' },
    { id: 3, name: 'Z9 Hall', category: 'Lecture Halls', capacity: '50', location: 'Block Z', status: 'Available' },
    { id: 4, name: 'Computer Lab', category: 'Labs', capacity: '50', location: 'IT Building', status: 'Maintenance' },
    { id: 5, name: 'Multimedia Projectors', category: 'Equipment', capacity: '5', location: 'IT Helpdesk', status: 'Available' },
    { id: 6, name: 'Faculty Vehicle - Van', category: 'Vehicles', capacity: '14', location: 'Transport Pool', status: 'Booked' }
];

let mockIdCounter = 7;

export class ResourceModel {
    static async findAll(): Promise<Resource[]> {
        try {
            const [rows] = await promisePool.query<RowDataPacket[]>(
                'SELECT * FROM resources ORDER BY created_at DESC'
            );
            return rows as Resource[];
        } catch (error) {
            console.warn('DB connection failed, falling back to mock data');
            return MOCK_RESOURCES;
        }
    }

    static async findById(id: number): Promise<Resource | null> {
        try {
            const [rows] = await promisePool.query<RowDataPacket[]>(
                'SELECT * FROM resources WHERE id = ?',
                [id]
            );
            if (rows.length === 0) return null;
            return rows[0] as Resource;
        } catch (error) {
            return MOCK_RESOURCES.find(r => r.id === id) || null;
        }
    }

    static async create(resource: Partial<Resource>): Promise<number> {
        const { name, category, capacity, location, status, equipment } = resource;
        try {
            const [result] = await promisePool.query<ResultSetHeader>(
                'INSERT INTO resources (name, category, capacity, location, status) VALUES (?, ?, ?, ?, ?)',
                [name, category, capacity, location, status || 'Available']
            );
            return result.insertId;
        } catch (error) {
            // Mock fallback
            const newId = mockIdCounter++;
            MOCK_RESOURCES.unshift({
                id: newId,
                name: name!,
                category: category!,
                capacity: capacity!,
                location: location!,
                status: status || 'Available',
                equipment: equipment || [],
            });
            return newId;
        }
    }

    static async update(id: number, data: Partial<Resource>): Promise<boolean> {
        try {
            const updates: string[] = [];
            const values: any[] = [];

            if (data.name !== undefined)     { updates.push('name = ?');     values.push(data.name); }
            if (data.category !== undefined) { updates.push('category = ?'); values.push(data.category); }
            if (data.capacity !== undefined) { updates.push('capacity = ?'); values.push(String(data.capacity)); }
            if (data.location !== undefined) { updates.push('location = ?'); values.push(data.location); }
            if (data.status !== undefined)   { updates.push('status = ?');   values.push(data.status); }

            if (updates.length === 0) return true;

            values.push(id);
            const query = `UPDATE resources SET ${updates.join(', ')} WHERE id = ?`;
            const [result] = await promisePool.query<ResultSetHeader>(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            // Mock fallback
            const resource = MOCK_RESOURCES.find(r => r.id === id);
            if (resource) {
                if (data.name !== undefined)     resource.name = data.name;
                if (data.category !== undefined) resource.category = data.category;
                if (data.capacity !== undefined) resource.capacity = String(data.capacity);
                if (data.location !== undefined) resource.location = data.location;
                if (data.status !== undefined)   resource.status = data.status;
                if (data.equipment !== undefined) resource.equipment = data.equipment;
                return true;
            }
            return false;
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const [result] = await promisePool.query<ResultSetHeader>(
                'DELETE FROM resources WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            // Mock fallback
            const index = MOCK_RESOURCES.findIndex(r => r.id === id);
            if (index !== -1) {
                MOCK_RESOURCES.splice(index, 1);
                return true;
            }
            return false;
        }
    }
}
