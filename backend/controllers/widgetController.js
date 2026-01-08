import Widget from '../models/Widget.js';

export const createWidget = async (req, res) => {
    try {
        const { dashboard_id, type, title, device_id, telemetry_column, position } = req.body;

        // Basic validation could go here

        const widget = await Widget.create({
            dashboard_id,
            type,
            title,
            device_id,
            telemetry_column,
            position
        });

        res.status(201).json(widget);
    } catch (error) {
        console.error('Create widget error:', error);
        res.status(500).json({ message: 'Server error creating widget.' });
    }
};

export const getWidgets = async (req, res) => {
    try {
        const { dashboardId } = req.params;
        const widgets = await Widget.findAll({
            where: { dashboard_id: dashboardId }
        });
        res.json(widgets);
    } catch (error) {
        console.error('Get widgets error:', error);
        res.status(500).json({ message: 'Server error fetching widgets.' });
    }
};

export const updateWidget = async (req, res) => {
    try {
        const { id } = req.params;
        const { position, title, device_id, telemetry_column } = req.body;

        const widget = await Widget.findByPk(id);
        if (!widget) return res.status(404).json({ message: 'Widget not found' });

        if (position) widget.position = position;
        if (title) widget.title = title;
        if (device_id) widget.device_id = device_id;
        if (telemetry_column) widget.telemetry_column = telemetry_column;

        await widget.save();
        res.json(widget);
    } catch (error) {
        console.error('Update widget error:', error);
        res.status(500).json({ message: 'Server error updating widget.' });
    }
};

export const deleteWidget = async (req, res) => {
    try {
        const { id } = req.params;
        const widget = await Widget.findByPk(id);
        if (!widget) return res.status(404).json({ message: 'Widget not found' });

        await widget.destroy();
        res.json({ message: 'Widget deleted' });
    } catch (error) {
        console.error('Delete widget error:', error);
        res.status(500).json({ message: 'Server error deleting widget.' });
    }
};
