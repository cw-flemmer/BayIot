import express from 'express';
import {
    createDashboard,
    getDashboards,
    updateDashboard,
    deleteDashboard
} from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import tenantDetection from '../middleware/tenantDetection.js';

const router = express.Router();

// Apply tenant detection and authentication to all dashboard routes
router.use(tenantDetection);
router.use(authMiddleware);

// Admin only routes
router.post('/', adminMiddleware, createDashboard);
router.put('/:id', adminMiddleware, updateDashboard);
router.delete('/:id', adminMiddleware, deleteDashboard);

// Common routes (Customers can only see their assigned dashboards via logic in controller)
router.get('/', getDashboards);

export default router;
