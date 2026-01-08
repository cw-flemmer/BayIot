import express from 'express';
import { getLatestTelemetry } from '../controllers/telemetryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/latest/:deviceId', getLatestTelemetry);

export default router;
