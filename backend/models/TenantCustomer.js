import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Tenant from './Tenant.js';

const TenantCustomer = sequelize.define('TenantCustomer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'customer',
    },
    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tenant,
            key: 'id',
        },
    },
}, {
    tableName: 'tenant_customers',
});

Tenant.hasMany(TenantCustomer, { foreignKey: 'tenant_id' });
TenantCustomer.belongsTo(Tenant, { foreignKey: 'tenant_id' });

export default TenantCustomer;
