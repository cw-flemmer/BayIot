const Tenant = require('../models/Tenant');

const tenantDetection = async (req, res, next) => {
    try {
        const host = req.headers.host;
        // Remove port if present
        const domain = host.split(':')[0];

        const tenant = await Tenant.findOne({ where: { domain } });

        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found for this domain.' });
        }

        req.tenant = tenant;
        next();
    } catch (error) {
        console.error('Tenant detection error:', error);
        res.status(500).json({ message: 'Internal server error during tenant detection.' });
    }
};

module.exports = tenantDetection;
