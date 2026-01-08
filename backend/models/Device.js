import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Tenant from './Tenant.js';

const Device = sequelize.define('Device', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tenant_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Tenant,
            key: 'uuid',
        },
    },
    customer: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    device: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'tenant_devices',
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'last_seen'
});

// Associations
Tenant.hasMany(Device, { foreignKey: 'tenant_uuid', sourceKey: 'uuid' });
Device.belongsTo(Tenant, { foreignKey: 'tenant_uuid', targetKey: 'uuid' });

export default Device;
