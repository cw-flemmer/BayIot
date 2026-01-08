const adminMiddleware = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'site-admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admin privileges required.' });
    }
};

export default adminMiddleware;
