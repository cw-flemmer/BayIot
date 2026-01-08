import express from 'express';
import { getLatestTelemetry } from '../controllers/telemetryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

import tenantDetection from '../middleware/tenantDetection.js';

const router = express.Router();

router.use(tenantDetection); // Ensure tenant is detected first
router.use(authMiddleware);

router.get('/latest/:deviceId', getLatestTelemetry);

export default router;
