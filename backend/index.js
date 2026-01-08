import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { connectDB } from './config/database.js';

const app = express();
const port = process.env.PORT || 3000;

import authRoutes from './routes/authRoutes.js';
import tenantDetection from './middleware/tenantDetection.js';

// Connect to Database
connectDB();

// Middleware
app.use(cors({
    origin: true, // For development; should be specific in production
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Tenant Branding Route (Public - used by frontend to get logos/colors)
app.get('/api/tenant/info', tenantDetection, (req, res) => {
    const { name, logo, theme } = req.tenant;
    res.json({ name, logo, theme });
});

// Auth Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('BayIot API is running...');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
