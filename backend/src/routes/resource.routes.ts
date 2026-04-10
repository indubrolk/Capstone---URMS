import { Router } from 'express';
import { getAllResources, createResource, updateResource, deleteResource } from '../controllers/resource.controller';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Publicly observable resources (or require login based on your current flow)
router.get('/', verifyToken, getAllResources);

// Admin only actions
router.post('/', verifyToken, requireAdmin, createResource);
router.patch('/:id', verifyToken, requireAdmin, updateResource);
router.delete('/:id', verifyToken, requireAdmin, deleteResource);

export default router;
