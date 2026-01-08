import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import TenantCustomer from '../models/TenantCustomer.js';

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role, tenant_id: user.tenant_id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

const setTokenCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const tenant_id = req.tenant.id;

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
            role: 'customer' // Default role
        });

        const { accessToken, refreshToken } = generateTokens(newUser);
        setTokenCookies(res, accessToken, refreshToken);

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const tenant_id = req.tenant.id;

        const user = await TenantCustomer.findOne({ where: { email, tenant_id } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const { accessToken, refreshToken } = generateTokens(user);
        setTokenCookies(res, accessToken, refreshToken);

        res.json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

export const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};

export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing.' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await TenantCustomer.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        const tokens = generateTokens(user);
        setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

        res.json({ message: 'Token refreshed' });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid refresh token.' });
    }
};
