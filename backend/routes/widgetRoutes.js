import express from 'express';
import { createWidget, getWidgets, updateWidget, deleteWidget } from '../controllers/widgetController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

import tenantDetection from '../middleware/tenantDetection.js';

const router = express.Router();

router.use(tenantDetection); // Ensure tenant is detected first
router.use(authMiddleware);

// Get widgets for a dashboard
router.get('/dashboard/:dashboardId', getWidgets);

// CRUD
router.post('/', adminMiddleware, createWidget);
router.put('/:id', updateWidget); // Permission check moved to controller
router.delete('/:id', adminMiddleware, deleteWidget);

export default router;
