import express from 'express';
const router = express.Router();
import * as mobileDashboardController from '../controllers/mobileDashboardController.js';

router.post('/list', mobileDashboardController.getDashboards);

export default router;
