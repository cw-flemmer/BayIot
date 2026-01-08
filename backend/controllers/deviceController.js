import Device from '../models/Device.js';

export const getDevices = async (req, res) => {
    try {
        // We link via tenant_uuid. req.tenant is populated by tenantDetection middleware.
        if (!req.tenant) {
            return res.status(404).json({ message: 'Tenant context missing.' });
        }

        const devices = await Device.findAll({
            where: { tenant_uuid: req.tenant.uuid },
            order: [['createdAt', 'DESC']]
        });

        res.json(devices);
    } catch (error) {
        console.error('Get devices error:', error);
        res.status(500).json({ message: 'Server error while fetching devices.' });
    }
};

export const createDevice = async (req, res) => {
    try {
        const { device, customer } = req.body;
        if (!req.tenant) {
            return res.status(404).json({ message: 'Tenant context missing.' });
        }

        const newDevice = await Device.create({
            device,
            customer,
            tenant_uuid: req.tenant.uuid
        });

        res.status(201).json({ message: 'Device created successfully', device: newDevice });
    } catch (error) {
        console.error('Create device error:', error);
        res.status(500).json({ message: 'Server error during device creation.' });
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
