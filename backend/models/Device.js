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
    device_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    last_seen: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    min_temperature: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    max_temperature: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    door_open_time_limit: {
        type: DataTypes.INTEGER, // Time in seconds before alerting
        allowNull: true,
    },
    alert_phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sms_alerts_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    last_sms_sent_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    door_opened_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'tenant_devices',
    underscored: true,
    timestamps: false
});

// Associations
Tenant.hasMany(Device, { foreignKey: 'tenant_uuid', sourceKey: 'uuid' });
Device.belongsTo(Tenant, { foreignKey: 'tenant_uuid', targetKey: 'uuid' });

export const initDeviceAssociations = (Dashboard) => {
    Dashboard.hasMany(Device, { foreignKey: 'dashboard_id' });
    Device.belongsTo(Dashboard, { foreignKey: 'dashboard_id', as: 'allocatedDashboard' });
};

export default Device;
