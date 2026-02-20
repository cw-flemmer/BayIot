import bcrypt from 'bcryptjs';
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

export const createCustomer = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const tenant_id = req.tenant.id;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        const existingUser = await TenantCustomer.findOne({ where: { email, tenant_id } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists for this tenant.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await TenantCustomer.create({
            name,
            email,
            password: hashedPassword,
            tenant_id,
            role: role || 'customer'
        });

        res.status(201).json({
            message: 'Customer created successfully',
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        console.error('Create customer error:', error);
        res.status(500).json({ message: 'Server error during customer creation.' });
    }
};

export const createCustomerTest = async (req, res) => {
    try {
        const { name, email, password, role, tenant_id } = req.body;

        if (!name || !email || !password || !tenant_id) {
            return res.status(400).json({ message: 'Name, email, password, and tenant_id are required.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await TenantCustomer.create({
            name,
            email,
            password: hashedPassword,
            tenant_id,
            role: role || 'customer'
        });

        res.status(201).json({
            message: 'Customer (Test) created successfully',
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, tenant_id: newUser.tenant_id }
        });
    } catch (error) {
        console.error('Create customer test error:', error);
        res.status(500).json({ message: 'Server error during test customer creation.' });
    }
};
