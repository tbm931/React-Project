import { DataTypes } from "sequelize";
import { connection } from '../connection/connection.js';
export const Users = connection.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    idNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pw: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
});
// connection.sync({ alter: false })
//     .then(() => console.log("✅ טבלת Users סונכרנה בהצלחה"))
//     .catch(err => console.error("❌ שגיאה בסנכרון:", err));