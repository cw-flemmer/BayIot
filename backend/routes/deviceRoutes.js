import express from 'express';
import { getDevices, createDevice, deleteDevice } from '../controllers/deviceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import tenantDetection from '../middleware/tenantDetection.js';

const router = express.Router();

// All device routes require tenant detection and authentication
router.use(tenantDetection);
router.use(authMiddleware);

// Admins can manage devices, customers can only view them (if permitted)
router.get('/', getDevices);
router.post('/', adminMiddleware, createDevice);
router.delete('/:id', adminMiddleware, deleteDevice);

export default router;
