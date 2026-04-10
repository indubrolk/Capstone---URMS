import { promisePool } from '../config/db.config';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Resource {
    id?: number;
    name: string;
    category: 'Lecture Halls' | 'Labs' | 'Equipment' | 'Vehicles';
    capacity: string;
    location: string;
    status: 'Available' | 'Booked' | 'Maintenance';
    created_at?: Date;
}

const MOCK_RESOURCES: Resource[] = [
    { id: 1, name: 'Main Auditorium', category: 'Lecture Halls', capacity: '500 seats', location: 'Block A', status: 'Available' },
    { id: 2, name: 'Mini Auditorium', category: 'Lecture Halls', capacity: '250 seats', location: 'Block B', status: 'Booked' },
    { id: 3, name: 'Z9 Hall', category: 'Lecture Halls', capacity: '50 seats', location: 'Block Z', status: 'Available' },
    { id: 4, name: 'Computer Lab', category: 'Labs', capacity: '50 PCs', location: 'IT Building', status: 'Maintenance' },
    { id: 5, name: 'Multimedia Projectors', category: 'Equipment', capacity: '5 units', location: 'IT Helpdesk', status: 'Available' },
    { id: 6, name: 'Faculty Vehicle - Van', category: 'Vehicles', capacity: '14 seats', location: 'Transport Pool', status: 'Booked' }
];

let mockIdCounter = 7;

export class ResourceModel {
    static async findAll(): Promise<Resource[]> {
        try {
            const [rows] = await promisePool.query<RowDataPacket[]>('SELECT * FROM resources ORDER BY created_at DESC');
            return rows as Resource[];
        } catch (error) {
            console.warn("DB connection failed, falling back to mock data");
            return MOCK_RESOURCES;
        }
    }

    static async findById(id: number): Promise<Resource | null> {
        try {
            const [rows] = await promisePool.query<RowDataPacket[]>('SELECT * FROM resources WHERE id = ?', [id]);
            if (rows.length === 0) return null;
            return rows[0] as Resource;
        } catch (error) {
            return MOCK_RESOURCES.find(r => r.id === id) || null;
        }
    }

    static async create(resource: Resource): Promise<number> {
        try {
            const [result] = await promisePool.query<ResultSetHeader>(
                'INSERT INTO resources (name, category, capacity, location, status) VALUES (?, ?, ?, ?, ?)',
                [resource.name, resource.category, resource.capacity, resource.location, resource.status || 'Available']
            );
            return result.insertId;
        } catch (error) {
            const newId = mockIdCounter++;
            MOCK_RESOURCES.unshift({ ...resource, id: newId });
            return newId;
        }
    }

    static async updateStatus(id: number, status: string): Promise<boolean> {
        try {
            const [result] = await promisePool.query<ResultSetHeader>(
                'UPDATE resources SET status = ? WHERE id = ?',
                [status, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            const resource = MOCK_RESOURCES.find(r => r.id === id);
            if (resource) {
                resource.status = status as any;
                return true;
            }
            return false;
        }
    }

    static async update(id: number, data: Partial<Resource>): Promise<boolean> {
        try {
            const updates: string[] = [];
            const values: any[] = [];

            if (data.name) { updates.push('name = ?'); values.push(data.name); }
            if (data.category) { updates.push('category = ?'); values.push(data.category); }
            if (data.capacity) { updates.push('capacity = ?'); values.push(data.capacity); }
            if (data.location) { updates.push('location = ?'); values.push(data.location); }
            if (data.status) { updates.push('status = ?'); values.push(data.status); }

            if (updates.length === 0) return true;

            values.push(id);
            const query = `UPDATE resources SET ${updates.join(', ')} WHERE id = ?`;
            
            const [result] = await promisePool.query<ResultSetHeader>(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            const resource = MOCK_RESOURCES.find(r => r.id === id);
            if (resource) {
                if (data.name) resource.name = data.name;
                if (data.category) resource.category = data.category as any;
                if (data.capacity) resource.capacity = data.capacity;
                if (data.location) resource.location = data.location;
                if (data.status) resource.status = data.status as any;
                return true;
            }
            return false;
        }
    }

    static async delete(id: number): Promise<boolean> {
        try {
            const [result] = await promisePool.query<ResultSetHeader>('DELETE FROM resources WHERE id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            const index = MOCK_RESOURCES.findIndex(r => r.id === id);
            if (index !== -1) {
                MOCK_RESOURCES.splice(index, 1);
                return true;
            }
            return false;
        }
    }
}
