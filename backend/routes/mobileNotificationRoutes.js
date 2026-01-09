import express from 'express';
const router = express.Router();
import * as mobileNotificationController from '../controllers/mobileNotificationController.js';

router.post('/unread-count', mobileNotificationController.getUnreadCount);
router.post('/latest', mobileNotificationController.getLatestNotifications);

export default router;
