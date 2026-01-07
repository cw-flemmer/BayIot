const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tenant = sequelize.define('Tenant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    domain: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    theme: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'light',
    },
}, {
    tableName: 'tenants',
});

module.exports = Tenant;
