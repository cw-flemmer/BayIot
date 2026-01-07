const { sequelize } = require('./config/database');
const Tenant = require('./models/Tenant');
const TenantCustomer = require('./models/TenantCustomer');
const TenantCustomerDevice = require('./models/TenantCustomerDevice');

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
