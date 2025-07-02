import log4js from "log4js";
log4js.configure({
    appenders: {
        business: { type: "file", filename: "./logs/Business.log" },
        client: { type: "file", filename: "./logs/Client.log" },
        lesson: { type: "file", filename: "./logs/Lesson.log" },
        service: { type: "file", filename: "./logs/Service.log" },
        user: { type: "file", filename: "./logs/User.log" },
    },
    categories: {
        business: { appenders: ["business"], level: "info" },
        client: { appenders: ["client"], level: "info" },
        lesson: { appenders: ["lesson"], level: "info" },
        service: { appenders: ["service"], level: "info" },
        user: { appenders: ["user"], level: "info" },
        default: { appenders: ["business", "client", "lesson", "service", "user"], level: "info" }
    }
});
export const businessLogger = log4js.getLogger("business");
export const clientLogger = log4js.getLogger("client");
export const lessonLogger = log4js.getLogger("lesson");
export const serviceLogger = log4js.getLogger("service");
export const userLogger = log4js.getLogger("user");
