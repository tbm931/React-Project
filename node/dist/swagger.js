import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from 'dotenv';
dotenv.config();
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Business Consulting API',
            version: '1.0.0',
            description: 'API documentation for Business Consulting application',
        },
        tags: [
            { name: 'Services', description: 'ניהול שירותים' },
            { name: 'Clients', description: 'ניהול לקוחות' },
            { name: 'Businesses', description: 'ניהול עסקים' },
            { name: 'Sign', description: 'ניהול אימות משתמשים' },
            { name: 'Meetings', description: 'ניהול פגישות' },
            { name: 'Users', description: 'ניהול משתמשים' },
        ],
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routes/*.js", "./app.js"],
};
const specs = swaggerJsdoc(options);
export { swaggerUi, specs };
