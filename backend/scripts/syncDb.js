import { sequelize } from '../config/database.js';
import Tenant from '../models/Tenant.js';
import TenantCustomer from '../models/TenantCustomer.js';
import TenantCustomerDevice from '../models/TenantCustomerDevice.js';

const initDB = async () => {
    try {
        await sequelize.sync({ force: false }); // Change to true if you want to drop tables
        console.log('Database synced successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error syncing database:', error);
        process.exit(1);
    }
};

initDB();
