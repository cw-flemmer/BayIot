import Notification from '../models/Notification.js';
import Tenant from '../models/Tenant.js';
import TenantCustomer from '../models/TenantCustomer.js';
import Dashboard from '../models/Dashboard.js';
import Widget from '../models/Widget.js';
import { Op } from 'sequelize';

// Helper to authenticate user from body
const getAuthenticatedUser = async (domain, email) => {
    try {
        if (!domain || !email) return null;

        const tenant = await Tenant.findOne({ where: { domain } });
        if (!tenant) return null;

        const user = await TenantCustomer.findOne({
            where: { email, tenant_id: tenant.id }
        });

        if (!user) return null;

        return { user, tenant };
    } catch (error) {
        console.error('getAuthenticatedUser error:', error);
        return null;
    }
};

// Helper to get device IDs relevant to the user
const getUserDeviceIds = async (user, tenantId) => {
    let dashboardQuery = { where: { tenant_id: tenantId } };

    // If user is a customer, filter dashboards assigned to them
    if (user.role === 'customer') {
        dashboardQuery.where.customer_id = user.id;
    }

    const dashboards = await Dashboard.findAll(dashboardQuery);
    const dashboardIds = dashboards.map(d => d.id);

    if (dashboardIds.length === 0) return [];

    const widgets = await Widget.findAll({
        where: { dashboard_id: dashboardIds },
        attributes: ['device_id'] // Only need device_id
    });

    // Extract unique device IDs, filtering out nulls
    const deviceIds = [...new Set(widgets.map(w => w.device_id).filter(id => id))];
    return deviceIds;
};

export const getUnreadCount = async (req, res) => {
    try {
        const { domain, email } = req.body;
        const auth = await getAuthenticatedUser(domain, email);

        if (!auth) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const deviceIds = await getUserDeviceIds(auth.user, auth.tenant.id);

        if (deviceIds.length === 0) {
            return res.json({ count: 0 });
        }

        const count = await Notification.count({
            where: {
                tenant_id: auth.tenant.id,
                is_read: false,
                device_id: deviceIds // Filter by accessible devices
            }
        });

        res.json({ count });
    } catch (error) {
        console.error('Mobile unread count error:', error);
        res.status(500).json({ message: 'Server error fetching unread count.', error: error.message });
    }
};

export const getLatestNotifications = async (req, res) => {
    try {
        const { domain, email } = req.body;
        const auth = await getAuthenticatedUser(domain, email);

        if (!auth) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const deviceIds = await getUserDeviceIds(auth.user, auth.tenant.id);

        if (deviceIds.length === 0) {
            return res.json([]);
        }

        const notifications = await Notification.findAll({
            where: {
                tenant_id: auth.tenant.id,
                device_id: deviceIds // Filter by accessible devices
            },
            order: [
                ['is_read', 'ASC'],
                ['created_at', 'DESC']
            ],
            limit: 20
        });

        res.json(notifications);
    } catch (error) {
        console.error('Mobile notifications error:', error);
        res.status(500).json({ message: 'Server error fetching notifications.', error: error.message });
    }
};
