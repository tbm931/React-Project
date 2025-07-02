import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();
export const connection = new Sequelize('BusinessConsulting', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mssql',
    port: 1433,
    dialectOptions: {
        encrypt: false,
        trustServerCertificate: true
    },
    logging: console.log
});
