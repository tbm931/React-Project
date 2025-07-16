import { DataTypes } from "sequelize";
import { connection } from '../connection/connection.js';
export const Meetings = connection.define('Meetings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    clientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    meetingStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Scheduled', 'Canceled', 'Completed']]
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    meetingDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    timestamps: false,
});
// connection.sync({ alter: false })
//     .then(() => console.log("✅ טבלת Meetings סונכרנה בהצלחה"))
//     .catch(err => console.error("❌ שגיאה בסנכרון:", err));
