import bcrypt from 'bcryptjs';
import TenantCustomer from '../models/TenantCustomer.js';

export const getCustomers = async (req, res) => {
    try {
        const tenant_id = req.tenant.id;
        const customers = await TenantCustomer.findAll({
            where: { tenant_id },
            attributes: ['id', 'name', 'email', 'role', 'sms_credit_limit', 'sms_credit_used', 'created_at']
        });
        res.json(customers);
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ message: 'Server error while fetching customers.' });
    }
};

export const createCustomer = async (req, res) => {
    try {
        const { name, email, password, role, sms_credit_limit } = req.body;
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
            role: role || 'customer',
            sms_credit_limit: sms_credit_limit !== undefined ? parseInt(sms_credit_limit, 10) : 100,
            sms_credit_used: 0,
        });

        res.status(201).json({
            message: 'Customer created successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                sms_credit_limit: newUser.sms_credit_limit,
                sms_credit_used: newUser.sms_credit_used,
            }
        });
    } catch (error) {
        console.error('Create customer error:', error);
        res.status(500).json({ message: 'Server error during customer creation.' });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const tenant_id = req.tenant.id;

        const customer = await TenantCustomer.findOne({ where: { id, tenant_id } });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        await customer.destroy();
        res.json({ message: 'Customer deleted successfully.' });
    } catch (error) {
        console.error('Delete customer error:', error);
        res.status(500).json({ message: 'Server error during customer deletion.' });
    }
};

export const updateSmsCredits = async (req, res) => {
    try {
        const { id } = req.params;
        const tenant_id = req.tenant.id;
        const { sms_credit_limit } = req.body;

        if (sms_credit_limit === undefined || isNaN(parseInt(sms_credit_limit, 10))) {
            return res.status(400).json({ message: 'sms_credit_limit (integer) is required.' });
        }

        const customer = await TenantCustomer.findOne({ where: { id, tenant_id } });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        customer.sms_credit_limit = parseInt(sms_credit_limit, 10);
        await customer.save();

        res.json({
            message: 'SMS credit limit updated.',
            sms_credit_limit: customer.sms_credit_limit,
            sms_credit_used: customer.sms_credit_used,
        });
    } catch (error) {
        console.error('Update SMS credits error:', error);
        res.status(500).json({ message: 'Server error updating SMS credits.' });
    }
};

export const resetSmsCredits = async (req, res) => {
    try {
        const { id } = req.params;
        const tenant_id = req.tenant.id;

        const customer = await TenantCustomer.findOne({ where: { id, tenant_id } });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        customer.sms_credit_used = 0;
        await customer.save();

        res.json({
            message: 'SMS credit usage reset to 0.',
            sms_credit_limit: customer.sms_credit_limit,
            sms_credit_used: 0,
        });
    } catch (error) {
        console.error('Reset SMS credits error:', error);
        res.status(500).json({ message: 'Server error resetting SMS credits.' });
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
