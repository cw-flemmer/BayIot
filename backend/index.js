import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { connectDB } from './config/database.js';

const app = express();
const port = process.env.PORT || 3000;

import authRoutes from './routes/authRoutes.js';
import tenantRoutes from './routes/tenantRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import tenantDetection from './middleware/tenantDetection.js';

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Tenant Branding Route (Public)
app.get('/api/tenant/info', tenantDetection, (req, res) => {
    const { name, logo, theme } = req.tenant;
    res.json({ name, logo, theme });
});

// Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/dashboards', dashboardRoutes);
app.use('/api/customers', customerRoutes);

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
