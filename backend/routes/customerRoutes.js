import express from 'express';
import { getCustomers, createCustomer, createCustomerTest } from '../controllers/customerController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import tenantDetection from '../middleware/tenantDetection.js';

const router = express.Router();

// Only admins can list all customers for the tenant (for assignment purposes)
router.get('/', tenantDetection, authMiddleware, adminMiddleware, getCustomers);

// Only admins can create new customers
router.post('/', tenantDetection, authMiddleware, adminMiddleware, createCustomer);

// Insecure endpoint for testing only
router.post('/test-create', createCustomerTest);

export default router;
