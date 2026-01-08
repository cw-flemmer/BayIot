import express from 'express';
import { getCustomers } from '../controllers/customerController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import tenantDetection from '../middleware/tenantDetection.js';

const router = express.Router();

// Only admins can list all customers for the tenant (for assignment purposes)
router.get('/', tenantDetection, authMiddleware, adminMiddleware, getCustomers);

export default router;
