import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js';
import tenantDetection from '../middleware/tenantDetection.js';

// All auth routes need tenant detection to know which customer pool to check
router.post('/register', tenantDetection, authController.register);
router.post('/login', tenantDetection, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

export default router;
