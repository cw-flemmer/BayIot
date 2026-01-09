import express from 'express';
const router = express.Router();
import * as mobileWidgetController from '../controllers/mobileWidgetController.js';

router.post('/dashboard/:dashboardId', mobileWidgetController.getWidgets);

export default router;
