import { Sequelize } from 'sequelize';


const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST || 'bayiot_mysql',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'BayIot',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'Sp0ng3B0B@Umicore',
    logging: false, // Set to console.log for debugging
    timezone: '+02:00',
    define: {
        timestamps: true,
        underscored: true,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const connectDB = async (retries = 5) => {
    while (retries) {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
            break;
        } catch (error) {
            console.error('Unable to connect to the database:', error.message);
            retries -= 1;
            console.log(`Retries left: ${retries}`);
            if (retries === 0) {
                console.error('Could not connect to database after several attempts. Exiting...');
                process.exit(1);
            }
            // Wait 5 seconds before retrying
            await new Promise(res => setTimeout(res, 5000));
        }
    }
};

export { sequelize, connectDB };
