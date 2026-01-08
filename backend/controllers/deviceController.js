import Device from '../models/Device.js';
import Dashboard from '../models/Dashboard.js';

export const getDevices = async (req, res) => {
    try {
        // We link via tenant_uuid. req.tenant is populated by tenantDetection middleware.
        if (!req.tenant) {
            console.error('Get devices: No tenant context in request');
            return res.status(404).json({ message: 'Tenant context missing.' });
        }

        console.log(`Fetching devices for tenant UUID: ${req.tenant.uuid}`);

        const devices = await Device.findAll({
            where: { tenant_uuid: req.tenant.uuid },
            include: [{
                model: Dashboard,
                as: 'allocatedDashboard',
                attributes: ['id', 'name']
            }],
            order: [['created_at', 'DESC']]
        });

        res.json(devices);
    } catch (error) {
        console.error('Get devices database error details:', error);
        res.status(500).json({
            message: 'Server error while fetching devices.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const createDevice = async (req, res) => {
    try {
        if (!req.tenant) {
            return res.status(404).json({ message: 'Tenant context missing.' });
        }

        const { device_id } = req.body;
        if (!device_id) {
            return res.status(400).json({ message: 'device_id is required.' });
        }

        const newDevice = await Device.create({
            device_id,
            tenant_uuid: req.tenant.uuid,
            created_at: new Date(),
            last_seen: new Date()
        });

        res.status(201).json({ message: 'Device created successfully', device: newDevice });
    } catch (error) {
        console.error('Create device error:', error);
        res.status(500).json({ message: 'Server error during device creation.' });
    }
};

export const allocateDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        const { dashboard_id } = req.body;

        const device = await Device.findOne({
            where: { id, tenant_uuid: req.tenant.uuid }
        });

        if (!device) {
            return res.status(404).json({ message: 'Device not found.' });
        }

        // Check if already allocated
        if (device.dashboard_id) {
            return res.status(400).json({ message: 'This device is already allocated to a dashboard.' });
        }

        device.dashboard_id = dashboard_id;
        await device.save();

        res.json({ message: 'Device allocated successfully', device });
    } catch (error) {
        console.error('Allocate device error:', error);
        res.status(500).json({ message: 'Server error during device allocation.' });
    }
};

export const deleteDevice = async (req, res) => {
    try {
        const { id } = req.params;
        const device = await Device.findOne({
            where: {
                id,
                tenant_uuid: req.tenant.uuid
            }
        });

        if (!device) {
            return res.status(404).json({ message: 'Device not found.' });
        }

        await device.destroy();
        res.json({ message: 'Device deleted successfully' });
    } catch (error) {
        console.error('Delete device error:', error);
        res.status(500).json({ message: 'Server error during device deletion.' });
    }
};
