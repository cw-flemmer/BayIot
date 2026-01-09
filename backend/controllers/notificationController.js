import Notification from '../models/Notification.js';

// Get all notifications for a tenant (unread first)
export const getNotifications = async (req, res) => {
    try {
        const tenantId = req.tenant.id;

        const notifications = await Notification.findAll({
            where: { tenant_id: tenantId },
            order: [
                ['is_read', 'ASC'],
                ['created_at', 'DESC']
            ],
            limit: 50 // Limit to last 50 notifications
        });

        res.json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Server error fetching notifications.' });
    }
};

// Get unread notifications count
export const getUnreadCount = async (req, res) => {
    try {
        const tenantId = req.tenant.id;

        const count = await Notification.count({
            where: {
                tenant_id: tenantId,
                is_read: false
            }
        });

        res.json({ count });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ message: 'Server error fetching unread count.' });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const tenantId = req.tenant.id;

        const notification = await Notification.findOne({
            where: {
                id,
                tenant_id: tenantId
            }
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.is_read = true;
        await notification.save();

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ message: 'Server error marking notification as read.' });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        const tenantId = req.tenant.id;

        await Notification.update(
            { is_read: true },
            {
                where: {
                    tenant_id: tenantId,
                    is_read: false
                }
            }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ message: 'Server error marking all notifications as read.' });
    }
};

// Create a new notification (typically called internally or by IoT devices)
export const createNotification = async (req, res) => {
    try {
        const { device_id, message } = req.body;
        const tenantId = req.tenant.id;

        if (!device_id || !message) {
            return res.status(400).json({ message: 'device_id and message are required' });
        }

        const notification = await Notification.create({
            tenant_id: tenantId,
            device_id,
            message
        });

        res.status(201).json(notification);
    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ message: 'Server error creating notification.' });
    }
};
