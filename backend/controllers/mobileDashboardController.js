import Dashboard from '../models/Dashboard.js';
import Tenant from '../models/Tenant.js';
import TenantCustomer from '../models/TenantCustomer.js';

export const getDashboards = async (req, res) => {
    try {
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

        // 3. Fetch Dashboards for this user
        let query = {
            where: { tenant_id: tenant.id },
            include: [{ model: TenantCustomer, as: 'assignedCustomer', attributes: ['id', 'name', 'email'] }]
        };

        // If 'customer', filter by their ID
        if (user.role === 'customer') {
            query.where.customer_id = user.id;
        }

        const dashboards = await Dashboard.findAll(query);
        res.json(dashboards);

    } catch (error) {
        console.error('Mobile get dashboards error:', error);
        res.status(500).json({ message: 'Server error while fetching dashboards.' });
    }
};
