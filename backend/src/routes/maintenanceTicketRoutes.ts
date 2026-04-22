import express from 'express';
import { verifyToken } from '../middleware/auth.middleware';
import {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
    deleteTicket
} from '../controllers/maintenanceTicketCtrl';

const router = express.Router();

// Apply auth middleware to all maintenance ticket routes
router.use(verifyToken);

// CRUD endpoints
router.post('/', createTicket as any);
router.get('/', getTickets as any);
router.get('/:id', getTicketById as any);
router.put('/:id', updateTicket as any);
router.delete('/:id', deleteTicket as any);

export default router;
