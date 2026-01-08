import Tenant from '../models/Tenant.js';

const tenantDetection = async (req, res, next) => {
    try {
        const host = req.headers.host;
        if (!host) {
            return res.status(400).json({ message: 'Host header is missing.' });
        }

        // Remove port if present
        const domain = host.split(':')[0];

        let tenant = await Tenant.findOne({ where: { domain } });

        // Developer/Localhost Fallback: If no tenant matches and we are on localhost, pick the first tenant
        if (!tenant && (domain === 'localhost' || domain === '127.0.0.1')) {
            tenant = await Tenant.findOne({ order: [['id', 'ASC']] });
            if (tenant) {
                console.log(`Development mode: Falling back to first tenant (ID: ${tenant.id}) for host ${domain}`);
            }
        }

        if (!tenant) {
            console.warn(`Tenant detection: No tenant found for domain ${domain}. Proceeding with req.tenant = null.`);
            req.tenant = null;
        } else {
            req.tenant = tenant;
        }
        next();
    } catch (error) {
        console.error('Tenant detection error details:', error);
        res.status(500).json({
            message: 'Internal server error during tenant detection.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default tenantDetection;
