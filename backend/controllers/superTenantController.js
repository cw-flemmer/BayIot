import Tenant from '../models/Tenant.js';

export const getAllTenants = async (req, res) => {
    try {
        const tenants = await Tenant.findAll({
            order: [['created_at', 'DESC']]
        });
        res.json(tenants);
    } catch (error) {
        console.error('Get all tenants error:', error);
        res.status(500).json({ message: 'Server error while fetching all tenants.' });
    }
};

export const createTenant = async (req, res) => {
    try {
        const { name, domain, theme } = req.body;

        const existingTenant = await Tenant.findOne({ where: { domain } });
        if (existingTenant) {
            return res.status(400).json({ message: 'A tenant with this domain already exists.' });
        }

        const tenant = await Tenant.create({
            name,
            domain,
            theme: theme || 'light'
        });

        res.status(201).json({ message: 'Tenant created successfully', tenant });
    } catch (error) {
        console.error('Create tenant error:', error);
        res.status(500).json({ message: 'Server error during tenant creation.' });
    }
};

export const updateTenant = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, domain, theme } = req.body;

        const tenant = await Tenant.findByPk(id);
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found.' });
        }

        if (domain && domain !== tenant.domain) {
            const existing = await Tenant.findOne({ where: { domain } });
            if (existing) {
                return res.status(400).json({ message: 'Domain already in use by another tenant.' });
            }
        }

        tenant.name = name || tenant.name;
        tenant.domain = domain || tenant.domain;
        tenant.theme = theme || tenant.theme;

        await tenant.save();
        res.json({ message: 'Tenant updated successfully', tenant });
    } catch (error) {
        console.error('Update tenant error:', error);
        res.status(500).json({ message: 'Server error during tenant update.' });
    }
};

export const deleteTenant = async (req, res) => {
    try {
        const { id } = req.params;
        const tenant = await Tenant.findByPk(id);
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found.' });
        }

        await tenant.destroy();
        res.json({ message: 'Tenant deleted successfully' });
    } catch (error) {
        console.error('Delete tenant error:', error);
        res.status(500).json({ message: 'Server error during tenant deletion.' });
    }
};
