import { Request, Response } from 'express';
import { ResourceModel } from '../models/resource.model';

export const getAllResources = async (req: Request, res: Response): Promise<void> => {
    try {
        const resources = await ResourceModel.findAll();
        res.status(200).json({ status: 'success', data: resources });
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const createResource = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, category, capacity, location, status, equipment } = req.body;

        if (!name || !category || !capacity || !location) {
            res.status(400).json({ status: 'error', message: 'Missing required fields: name, category, capacity, location' });
            return;
        }

        const insertId = await ResourceModel.create({
            name,
            category,
            capacity: String(capacity),
            location,
            status: status || 'Available',
            equipment: Array.isArray(equipment) ? equipment : [],
        });

        const newResource = await ResourceModel.findById(insertId);
        res.status(201).json({ status: 'success', data: newResource });
    } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const updateResource = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);

        if (isNaN(id)) {
            res.status(400).json({ status: 'error', message: 'Invalid resource ID' });
            return;
        }

        const { name, category, capacity, location, status, equipment } = req.body;
        const updates: Record<string, any> = {};

        if (name !== undefined)     updates.name     = name;
        if (category !== undefined) updates.category = category;
        if (capacity !== undefined) updates.capacity = String(capacity);
        if (location !== undefined) updates.location = location;
        if (status !== undefined)   updates.status   = status;
        if (equipment !== undefined) updates.equipment = equipment;

        if (Object.keys(updates).length === 0) {
            res.status(400).json({ status: 'error', message: 'No update data provided' });
            return;
        }

        const success = await ResourceModel.update(id, updates);

        if (!success) {
            res.status(404).json({ status: 'error', message: 'Resource not found' });
            return;
        }

        res.status(200).json({ status: 'success', message: 'Resource updated successfully' });
    } catch (error) {
        console.error('Error updating resource:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const deleteResource = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string);

        if (isNaN(id)) {
            res.status(400).json({ status: 'error', message: 'Invalid resource ID' });
            return;
        }

        const success = await ResourceModel.delete(id);

        if (!success) {
            res.status(404).json({ status: 'error', message: 'Resource not found' });
            return;
        }

        res.status(200).json({ status: 'success', message: 'Resource deleted successfully' });
    } catch (error) {
        console.error('Error deleting resource:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
