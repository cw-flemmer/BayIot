import Widget from '../models/Widget.js';
import Dashboard from '../models/Dashboard.js';
import Tenant from '../models/Tenant.js';
import TenantCustomer from '../models/TenantCustomer.js';

export const getWidgets = async (req, res) => {
    try {
        const { dashboardId } = req.params;
        const { domain, email } = req.body;

        if (!domain || !email) {
            return res.status(400).json({ message: 'Domain and email are required.' });
        }

        // 1. Find Tenant
        const tenant = await Tenant.findOne({ where: { domain } });
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found.' });
        }

        // 2. Find User
        const user = await TenantCustomer.findOne({
            where: {
                email,
                tenant_id: tenant.id
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found in this tenant.' });
        }

        // 3. Verify Dashboard Access
        const dashboard = await Dashboard.findOne({ where: { id: dashboardId, tenant_id: tenant.id } });

        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found.' });
        }

        // If customer, ensure they are assigned to this dashboard
        if (user.role === 'customer' && dashboard.customer_id !== user.id) {
            return res.status(403).json({ message: 'Access denied to this dashboard.' });
        }

        // 4. Fetch Widgets
        const widgets = await Widget.findAll({
            where: { dashboard_id: dashboardId },
            order: [['id', 'ASC']]
        });

        res.json(widgets);

    } catch (error) {
        console.error('Mobile get widgets error:', error);
        res.status(500).json({ message: 'Server error while fetching widgets.' });
    }
};
