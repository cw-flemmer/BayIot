import express from 'express';
const router = express.Router();
import * as mobileTelemetryController from '../controllers/mobileTelemetryController.js';

router.post('/latest/:deviceId', mobileTelemetryController.getLatestTelemetry);

export default router;
