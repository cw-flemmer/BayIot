import Telemetry from '../models/Telemetry.js';
import Tenant from '../models/Tenant.js';
import TenantCustomer from '../models/TenantCustomer.js';

export const getLatestTelemetry = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { domain, email } = req.body;

        if (!domain || !email) {
            return res.status(400).json({ message: 'Domain and email are required.' });
        }

        // 1. Find Tenant
        const tenant = await Tenant.findOne({ where: { domain } });
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found.' });
        }

        // 2. Find User
        const user = await TenantCustomer.findOne({
            where: {
                email,
                tenant_id: tenant.id
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found in this tenant.' });
        }

        // 3. Fetch Telemetry
        // Note: Ideally we should verify if the user has access to this specific deviceId
        // but for now we are replicating the original logic which just fetched by deviceId.
        // We could add 'where: { tenant_id: tenant.id }' if Telemetry model has it, or join with Devices.

        const latest = await Telemetry.findOne({
            where: { device_id: deviceId },
            order: [['created_at', 'DESC']]
        });

        if (!latest) {
            return res.json({});
        }

        res.json(latest);

    } catch (error) {
        console.error('Mobile telemetry fetch error:', error);
        res.status(500).json({ message: 'Server error fetching telemetry.' });
    }
};
