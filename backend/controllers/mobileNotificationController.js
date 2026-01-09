import Notification from '../models/Notification.js';
import Tenant from '../models/Tenant.js';
import TenantCustomer from '../models/TenantCustomer.js';

// Helper to authenticate user from body
const getAuthenticatedUser = async (domain, email) => {
    if (!domain || !email) return null;

    const tenant = await Tenant.findOne({ where: { domain } });
    if (!tenant) return null;

    const user = await TenantCustomer.findOne({
        where: { email, tenant_id: tenant.id }
    });

    if (!user) return null;

    return { user, tenant };
};

export const getUnreadCount = async (req, res) => {
    try {
        const { domain, email } = req.body;
        const auth = await getAuthenticatedUser(domain, email);

        if (!auth) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const count = await Notification.count({
            where: {
                tenant_id: auth.tenant.id,
                is_read: false
            }
        });

        res.json({ count });
    } catch (error) {
        console.error('Mobile unread count error:', error);
        res.status(500).json({ message: 'Server error fetching unread count.' });
    }
};

export const getLatestNotifications = async (req, res) => {
    try {
        const { domain, email } = req.body;
        const auth = await getAuthenticatedUser(domain, email);

        if (!auth) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const notifications = await Notification.findAll({
            where: { tenant_id: auth.tenant.id },
            order: [
                ['is_read', 'ASC'],
                ['created_at', 'DESC']
            ],
            limit: 10 // Fetch last 10 for mobile background check
        });

        res.json(notifications);
    } catch (error) {
        console.error('Mobile notifications error:', error);
        res.status(500).json({ message: 'Server error fetching notifications.' });
    }
};
