import express from 'express';
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    createNotification
} from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import tenantDetection from '../middleware/tenantDetection.js';

const router = express.Router();

router.use(tenantDetection);
router.use(authMiddleware);

// Get all notifications
router.get('/', getNotifications);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Mark notification as read
router.put('/:id/read', markAsRead);

// Mark all as read
router.put('/mark-all-read', markAllAsRead);

// Create notification (for testing or IoT devices)
router.post('/', createNotification);

export default router;
