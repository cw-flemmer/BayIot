import bcrypt from 'bcryptjs';
import Tenant from '../models/Tenant.js';
import TenantCustomer from '../models/TenantCustomer.js';

export const login = async (req, res) => {
    try {
        const { domain, email, password } = req.body;

        if (!domain || !email || !password) {
            return res.status(400).json({ message: 'Domain, email, and password are required.' });
        }

        // 1. Check if tenant exists
        const tenant = await Tenant.findOne({ where: { domain } });
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found.' });
        }

        // 2. Check if user exists in that tenant
        const user = await TenantCustomer.findOne({
            where: {
                email,
                tenant_id: tenant.id
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 3. Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // 4. Return success (No JWT as requested)
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                tenant_id: tenant.id,
                tenant_domain: tenant.domain
            }
        });

    } catch (error) {
        console.error('Mobile login error:', error);
        res.status(500).json({ message: 'Server error during mobile login.' });
    }
};
