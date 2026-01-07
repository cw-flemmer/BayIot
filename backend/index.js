const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { connectDB } = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
const tenantDetection = require('./middleware/tenantDetection');

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
