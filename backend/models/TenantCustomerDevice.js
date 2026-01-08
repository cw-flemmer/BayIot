import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import TenantCustomer from './TenantCustomer.js';

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
    underscored: true,
});

TenantCustomer.hasMany(TenantCustomerDevice, { foreignKey: 'tenant_customer_id' });
TenantCustomerDevice.belongsTo(TenantCustomer, { foreignKey: 'tenant_customer_id' });

export default TenantCustomerDevice;
