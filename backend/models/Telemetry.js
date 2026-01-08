import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Telemetry = sequelize.define('Telemetry', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    device_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    temperature: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    humidity: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    door_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    battery_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'telemetry',
    underscored: true,
    timestamps: false
});

export default Telemetry;
