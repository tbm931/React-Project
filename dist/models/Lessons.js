import { DataTypes } from "sequelize";
import { connection } from '../connection/connection.js';
export const Lessons = connection.define('Lessons', {
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
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    durationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lessonStatus: {
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
    priceAtTime: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    lessonDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
}, {
    timestamps: false,
});
// connection.sync({ alter: false })
//     .then(() => console.log("✅ טבלת Lessons סונכרנה בהצלחה"))
//     .catch(err => console.error("❌ שגיאה בסנכרון:", err));
