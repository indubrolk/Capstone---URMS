import { Request, Response } from 'express';
import { MaintenanceTicketModel } from '../models/maintenanceTicket.model';

// Interface extending Request to include the user injected by auth.middleware
interface AuthRequest extends Request {
    user?: any;
}

// Helper for RBAC
const isStaffOrAdmin = (user: any) => {
    if (!user) return false;
    return (
        user.uid === 'dev-user' || 
        user.admin === true || 
        user.role === 'admin' || 
        user.role === 'maintenance'
    );
};

export const createTicket = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { resourceId, title, description, priority } = req.body;

        if (!resourceId || !title || !priority) {
            res.status(400).json({ message: 'Validation error: resourceId, title, and priority are required' });
            return;
        }

        if (!req.user || !req.user.uid) {
            res.status(401).json({ message: 'Unauthorized: User missing from request' });
            return;
        }

        const ticketId = await MaintenanceTicketModel.create({
            resourceId,
            title,
            description: description || '',
            priority,
            createdBy: req.user.uid
        });

        res.status(201).json({
            message: 'Maintenance ticket created successfully',
            ticketId
        });
    } catch (error) {
        console.error('Error creating maintenance ticket:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTickets = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const filters: any = {};
        
        if (req.query.status) filters.status = req.query.status;
        if (req.query.priority) filters.priority = req.query.priority;
        if (req.query.resourceId) filters.resourceId = req.query.resourceId;

        // Role-Based Filtering
        if (req.user && !isStaffOrAdmin(req.user)) {
            // Students/Lecturers can only see their own tickets
            filters.createdBy = req.user.uid;
        } else if (req.query.createdBy) {
            filters.createdBy = req.query.createdBy;
        }

        const tickets = await MaintenanceTicketModel.findAll(filters);
        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getTicketById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid ticket ID' });
            return;
        }

        const ticket = await MaintenanceTicketModel.findById(id);
        if (!ticket) {
            res.status(404).json({ message: 'Maintenance ticket not found' });
            return;
        }

        // Enforce RBAC for viewing
        if (req.user && !isStaffOrAdmin(req.user) && ticket.createdBy !== req.user.uid) {
            res.status(403).json({ message: 'Forbidden: You can only view your own tickets' });
            return;
        }

        res.status(200).json(ticket);
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTicket = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Enforce RBAC for updating mapping to requirement: Only Admin / Maintenance Staff
        if (!req.user || !isStaffOrAdmin(req.user)) {
            res.status(403).json({ message: 'Forbidden: Only administrators or maintenance staff can update tickets' });
            return;
        }

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid ticket ID' });
            return;
        }

        const { status, priority, description, assignedTo } = req.body;
        
        const success = await MaintenanceTicketModel.update(id, {
            status,
            priority,
            description,
            assignedTo
        });

        if (!success) {
            res.status(404).json({ message: 'Maintenance ticket not found' });
            return;
        }

        res.status(200).json({ message: 'Maintenance ticket updated successfully' });
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteTicket = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Enforce RBAC for deleting: Only Admin / Maintenance Staff
        if (!req.user || !isStaffOrAdmin(req.user)) {
            res.status(403).json({ message: 'Forbidden: Only administrators or maintenance staff can delete tickets' });
            return;
        }

        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid ticket ID' });
            return;
        }

        const success = await MaintenanceTicketModel.delete(id);
        if (!success) {
            res.status(404).json({ message: 'Maintenance ticket not found' });
            return;
        }

        res.status(200).json({ message: 'Maintenance ticket deleted successfully' });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
