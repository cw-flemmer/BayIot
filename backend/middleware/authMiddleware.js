import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Ensure the user belongs to the current tenant, unless they are a site-admin
        if (req.user.role !== 'site-admin') {
            if (!req.tenant || req.user.tenant_id !== req.tenant.id) {
                return res.status(403).json({ message: 'Access denied: Tenant mismatch.' });
            }
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

export default authMiddleware;
