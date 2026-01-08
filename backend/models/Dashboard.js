import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Tenant from './Tenant.js';
import TenantCustomer from './TenantCustomer.js';

const Dashboard = sequelize.define('Dashboard', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Tenant,
            key: 'id',
        },
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TenantCustomer,
            key: 'id',
        },
    },
}, {
    tableName: 'dashboards',
});

// Associations
Tenant.hasMany(Dashboard, { foreignKey: 'tenant_id' });
Dashboard.belongsTo(Tenant, { foreignKey: 'tenant_id' });

TenantCustomer.hasMany(Dashboard, { foreignKey: 'customer_id', as: 'assignedDashboards' });
Dashboard.belongsTo(TenantCustomer, { foreignKey: 'customer_id', as: 'assignedCustomer' });

export default Dashboard;
