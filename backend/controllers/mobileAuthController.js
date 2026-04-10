import bcrypt from 'bcryptjs';
import Tenant from '../models/Tenant.js';
import TenantCustomer from '../models/TenantCustomer.js';

export const login = async (req, res) => {
    try {
        const { domain, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        let tenant;
        let user;

        if (domain) {
            // 1a. Find tenant by provided domain
            tenant = await Tenant.findOne({ where: { domain } });
            if (!tenant) {
                return res.status(404).json({ message: 'Tenant not found.' });
            }

            // 1b. Find user in that tenant
            user = await TenantCustomer.findOne({
                where: {
                    email,
                    tenant_id: tenant.id
                }
            });
        } else {
            // 2a. Find user globally by email (Unique constraint makes this safe)
            user = await TenantCustomer.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            // 2b. Find associated tenant
            tenant = await Tenant.findByPk(user.tenant_id);
            if (!tenant) {
                return res.status(404).json({ message: 'Associated tenant not found.' });
            }
        }

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
