import { DataTypes } from "sequelize";
import { connection } from '../connection/connection.js';
export const Services = connection.define('AllServices', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    businessId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    serviceName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    serviceDescription: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    durationMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    timestamps: false,
});
// await connection.sync({ alter: false });
// connection.sync({ alter: true })
//     .then(() => console.log("✅ טבלת Services סונכרנה בהצלחה"))
//     .catch(err => console.error("❌ שגיאה בסנכרון:", err));
