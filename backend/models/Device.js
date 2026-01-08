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
    last_seen: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'tenant_devices',
    underscored: true,
});

// Associations
Tenant.hasMany(Device, { foreignKey: 'tenant_uuid', sourceKey: 'uuid' });
Device.belongsTo(Tenant, { foreignKey: 'tenant_uuid', targetKey: 'uuid' });

export default Device;
