import TenantCustomer from '../models/TenantCustomer.js';

export const getCustomers = async (req, res) => {
    try {
        const tenant_id = req.tenant.id;
        const customers = await TenantCustomer.findAll({
            where: { tenant_id },
            attributes: ['id', 'name', 'email', 'role']
        });
        res.json(customers);
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ message: 'Server error while fetching customers.' });
    }
};
