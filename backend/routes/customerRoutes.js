import express from 'express';
import {
    getCustomers,
    createCustomer,
    deleteCustomer,
    updateSmsCredits,
    resetSmsCredits,
    createCustomerTest,
} from '../controllers/customerController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import tenantDetection from '../middleware/tenantDetection.js';

const router = express.Router();

const auth = [tenantDetection, authMiddleware, adminMiddleware];

// List all customers (includes sms_credit_limit + sms_credit_used)
router.get('/', ...auth, getCustomers);

// Create a new customer
router.post('/', ...auth, createCustomer);

// Delete a customer
router.delete('/:id', ...auth, deleteCustomer);

// Update SMS credit limit for a customer
router.put('/:id/sms-credits', ...auth, updateSmsCredits);

// Reset SMS credit usage counter to 0
router.post('/:id/sms-credits/reset', ...auth, resetSmsCredits);

// Insecure endpoint for testing only
router.post('/test-create', createCustomerTest);

export default router;

