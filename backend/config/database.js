const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: '11.0.1.36',
    database: 'BayIot',
    username: 'BayIot',
    password: 'Sp0ng3B0B@Umicore',
    logging: console.log,
    timezone: '+02:00', // Ensure UTC consistency
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, connectDB };
