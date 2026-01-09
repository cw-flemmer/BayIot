import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { connectDB } from './config/database.js';
import Dashboard from './models/Dashboard.js';
import Device, { initDeviceAssociations } from './models/Device.js';

// Initialize associations
initDeviceAssociations(Dashboard);

const app = express();
const port = process.env.PORT || 3000;

import authRoutes from './routes/authRoutes.js';
import tenantRoutes from './routes/tenantRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import superTenantRoutes from './routes/superTenantRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';
import widgetRoutes from './routes/widgetRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import mobileAuthRoutes from './routes/mobileAuthRoutes.js';
import mobileDashboardRoutes from './routes/mobileDashboardRoutes.js';
import tenantDetection from './middleware/tenantDetection.js';

// Middleware
app.use(cors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Domain']
}));
app.use(express.json());
app.use(cookieParser());

// Tenant Branding Route (Public)
app.get('/api/tenant/info', tenantDetection, (req, res) => {
    try {
        if (!req.tenant) {
            return res.json({
                name: 'BayIot',
                logo: null,
                theme: 'dark'
            });
        }
        const tenantData = req.tenant.get({ plain: true });
        console.log(`Branding fetch for ${req.tenant.domain}:`, tenantData);
        // We only want to expose branding-related fields publicly
        const { name, logo, theme } = tenantData;
        res.json({ name, logo, theme });
    } catch (error) {
        console.error('Branding fetch error:', error);
        res.status(500).json({ message: 'Error fetching branding info' });
    }
});

// Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/dashboards', dashboardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/super/tenants', superTenantRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/widgets', widgetRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/mobile/auth', mobileAuthRoutes);
app.use('/api/mobile/dashboards', mobileDashboardRoutes);

app.get('/', (req, res) => {
    res.send('BayIot API is running...');
});

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
