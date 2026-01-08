import Telemetry from '../models/Telemetry.js';

export const getLatestTelemetry = async (req, res) => {
    try {
        // device_id is a string (e.g., 'SN-123')
        const { deviceId } = req.params;

        const latest = await Telemetry.findOne({
            where: { device_id: deviceId },
            order: [['created_at', 'DESC']]
        });

        if (!latest) {
            return res.json({});
        }

        res.json(latest);
    } catch (error) {
        console.error('Telemetry fetch error:', error);
        res.status(500).json({ message: 'Server error fetching telemetry.' });
    }
};
