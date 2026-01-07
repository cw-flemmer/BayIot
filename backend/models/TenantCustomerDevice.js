const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const TenantCustomer = require('./TenantCustomer');

const TenantCustomerDevice = sequelize.define('TenantCustomerDevice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tenant_customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TenantCustomer,
            key: 'id',
        },
    },
}, {
    tableName: 'tenant_customer_devices',
});

TenantCustomer.hasMany(TenantCustomerDevice, { foreignKey: 'tenant_customer_id' });
TenantCustomerDevice.belongsTo(TenantCustomer, { foreignKey: 'tenant_customer_id' });

module.exports = TenantCustomerDevice;
