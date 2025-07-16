import { DataTypes } from "sequelize";
import { connection } from '../connection/connection.js'
export const Business = connection.define('Business', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    businessName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    businessAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true,
        },
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: false,
});

connection.sync({ alter: false })
  .then(() => console.log("✅ טבלת Business סונכרנה בהצלחה"))
  .catch(err => console.error("❌ שגיאה בסנכרון:", err));