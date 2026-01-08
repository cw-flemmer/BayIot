import Dashboard from '../models/Dashboard.js';
import TenantCustomer from '../models/TenantCustomer.js';

export const createDashboard = async (req, res) => {
    try {
        const { name, description, customer_id } = req.body;
        const tenant_id = req.tenant.id;

        // If customer_id is provided, verify it belongs to the same tenant
        if (customer_id) {
            const customer = await TenantCustomer.findOne({ where: { id: customer_id, tenant_id } });
            if (!customer) {
                return res.status(400).json({ message: 'Invalid customer selection.' });
            }
        }

        const dashboard = await Dashboard.create({
            name,
            description,
            tenant_id,
            customer_id: customer_id || null
        });

        res.status(201).json({ message: 'Dashboard created successfully', dashboard });
    } catch (error) {
        console.error('Create dashboard error:', error);
        res.status(500).json({ message: 'Server error during dashboard creation.' });
    }
};

export const getDashboards = async (req, res) => {
    try {
        const tenant_id = req.tenant.id;
        let query = { where: { tenant_id }, include: [{ model: TenantCustomer, as: 'assignedCustomer', attributes: ['id', 'name', 'email'] }] };

        // If the user is a customer, they can only see dashboards assigned to them
        if (req.user.role === 'customer') {
            query.where.customer_id = req.user.id;
        }

        const dashboards = await Dashboard.findAll(query);
        res.json(dashboards);
    } catch (error) {
        console.error('Get dashboards error:', error);
        res.status(500).json({ message: 'Server error while fetching dashboards.' });
    }
};

export const getDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        const tenant_id = req.tenant.id;

        const dashboard = await Dashboard.findOne({
            where: { id, tenant_id },
            include: [{ model: TenantCustomer, as: 'assignedCustomer', attributes: ['id', 'name', 'email'] }]
        });

        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found.' });
        }

        // Security check for customers
        if (req.user.role === 'customer' && dashboard.customer_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        res.json(dashboard);
    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ message: 'Server error fetching dashboard.' });
    }
};

export const updateDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, customer_id } = req.body;
        const tenant_id = req.tenant.id;

        const dashboard = await Dashboard.findOne({ where: { id, tenant_id } });
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found.' });
        }

        if (customer_id) {
            const customer = await TenantCustomer.findOne({ where: { id: customer_id, tenant_id } });
            if (!customer) {
                return res.status(400).json({ message: 'Invalid customer selection.' });
            }
        }

        dashboard.name = name || dashboard.name;
        dashboard.description = description || dashboard.description;
        dashboard.customer_id = customer_id !== undefined ? customer_id : dashboard.customer_id;

        await dashboard.save();
        res.json({ message: 'Dashboard updated successfully', dashboard });
    } catch (error) {
        console.error('Update dashboard error:', error);
        res.status(500).json({ message: 'Server error during dashboard update.' });
    }
};

export const deleteDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        const tenant_id = req.tenant.id;

        const dashboard = await Dashboard.findOne({ where: { id, tenant_id } });
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found.' });
        }

        await dashboard.destroy();
        res.json({ message: 'Dashboard deleted successfully' });
    } catch (error) {
        console.error('Delete dashboard error:', error);
        res.status(500).json({ message: 'Server error during dashboard deletion.' });
    }
};
