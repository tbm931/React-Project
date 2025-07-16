import { DataTypes } from "sequelize";
import { connection } from '../connection/connection.js'
export const Clients = connection.define('Clients', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    clientName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        validate: { len: [9, 10] },
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        validate: { isEmail: true },
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    pw: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
});

connection.sync({ alter: false })
    .then(() => console.log("✅ טבלת Clients סונכרנה בהצלחה"))
    .catch(err => console.error("❌ שגיאה בסנכרון:", err));