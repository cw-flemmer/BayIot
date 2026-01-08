import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Dashboard from './Dashboard.js';

const Widget = sequelize.define('Widget', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    dashboard_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Dashboard,
            key: 'id',
        },
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    device_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    telemetry_column: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    position: {
        type: DataTypes.JSON,
        allowNull: true,
    }
}, {
    tableName: 'widgets',
    underscored: true,
});

// Associations
Dashboard.hasMany(Widget, { foreignKey: 'dashboard_id', onDelete: 'CASCADE' });
Widget.belongsTo(Dashboard, { foreignKey: 'dashboard_id', as: 'dashboard' });

export default Widget;
