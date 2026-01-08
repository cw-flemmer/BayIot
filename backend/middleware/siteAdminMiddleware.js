const siteAdminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'site-admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Site-Admin privileges required.' });
    }
};

export default siteAdminMiddleware;
