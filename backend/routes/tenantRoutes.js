import express from 'express';
import { updateSettings } from '../controllers/tenantController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import tenantDetection from '../middleware/tenantDetection.js';

const router = express.Router();

// Only admins can update tenant settings
router.put('/settings', tenantDetection, authMiddleware, adminMiddleware, updateSettings);

export default router;
