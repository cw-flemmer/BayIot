import express from 'express';
import { getLatestTelemetry } from '../controllers/telemetryController.js';
import { ingestTelemetry } from '../controllers/telemetryIngestionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

import tenantDetection from '../middleware/tenantDetection.js';

const router = express.Router();

// Ingestion route (often called by internal node-red or hardware auth, so it shouldn't require user token)
router.post('/ingest', ingestTelemetry);

router.use(tenantDetection); // Ensure tenant is detected first
router.use(authMiddleware);

router.get('/latest/:deviceId', getLatestTelemetry);

export default router;
