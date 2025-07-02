import { Lessons } from '../models/Lessons.js';
import { getServices } from './ServicesController.js';
import { Op } from 'sequelize';
import { lessonLogger } from '../logger.js';
export const getLessons = async (req, res) => {
    try {
        const services = await getServices(req);
        if (services == null) {
            lessonLogger.error("Unauthorized access attempt to get lessons.");
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        const servicesId = services.map((service) => service.id);
        const lessons = await Lessons.findAll({ where: { serviceId: { [Op.in]: servicesId } } });
        const lesson = lessons.map(lesson => lesson.get({ plain: true }));
        lessonLogger.info("lessons returned successfully: " + JSON.stringify(lesson));
        res.status(200).send(lesson);
    }
    catch (err) {
        lessonLogger.error("Failed to get lessons: " + err);
        res.status(500).send("failed to get lessons. " + err);
    }
};
export const getLesson = async (req, res) => {
    try {
        const services = await getServices(req);
        if (services == null) {
            lessonLogger.error("Unauthorized access attempt to get lesson with ID: " + req.params.lessonId);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        const servicesId = services.map((service) => service.id);
        const lessonModel = await Lessons.findOne({ where: { id: req.params.lessonId, serviceId: { [Op.in]: servicesId } } });
        if (lessonModel != null) {
            const lesson = lessonModel.toJSON();
            lessonLogger.info(`Retrieved lesson with ID: ${req.params.lessonId} successfully.`);
            res.status(200).send(lesson);
        }
        else {
            lessonLogger.error("Lesson not found with ID: " + req.params.lessonId);
            res.status(500).send("failed to get lesson.");
        }
    }
    catch (err) {
        lessonLogger.error("Failed to get lesson with ID: " + req.params.lessonId + ". Error: " + err);
        res.status(500).send("failed to get lesson. " + err);
    }
};
export const createLesson = async (req, res) => {
    try {
        const services = await getServices(req);
        if (services == null) {
            lessonLogger.error("Unauthorized access attempt to create lesson.");
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        const servicesId = [];
        services.map((service) => servicesId.push(service.id));
        if (servicesId.findIndex((serviceId) => req.body.newLesson.serviceId === serviceId)) {
            lessonLogger.error("Unauthorized access attempt to create lesson for service ID: " + req.body.newLesson.serviceId);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        req.body.newLesson.scheduledAt = new Date(req.body.newLesson.scheduledAt);
        req.body.newLesson.lessonDate = new Date(req.body.newLesson.lessonDate);
        await Lessons.create(req.body.newLesson);
        lessonLogger.info("Lesson created successfully with details: " + JSON.stringify(req.body.newLesson));
        res.status(200).send("Lesson saved successfully!");
    }
    catch (err) {
        lessonLogger.error("Failed to create lesson. Error: " + err);
        res.status(500).send("failed to create lesson. " + err);
    }
};
export const updateLesson = async (req, res) => {
    try {
        const services = await getServices(req);
        if (services == null) {
            lessonLogger.error("Unauthorized access attempt to update lesson with ID: " + req.params.lessonId);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        const servicesId = [];
        services.map((service) => servicesId.push(service.id));
        if (servicesId.findIndex((serviceId) => req.body.newLesson.serviceId === serviceId)) {
            lessonLogger.error("Unauthorized access attempt to update lesson for service ID: " + req.body.newLesson.serviceId);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        await Lessons.update(req.body.newLesson, { where: { id: req.params.lessonId } });
        lessonLogger.info("Lesson updated successfully with details: " + JSON.stringify(req.body.newLesson));
        res.status(200).send("Lesson saved successfully!");
    }
    catch (err) {
        lessonLogger.error("Failed to update lesson with ID: " + req.params.lessonId + ". Error: " + err);
        res.status(500).send("failed to update lesson. " + err);
    }
};
export const deleteLesson = async (req, res) => {
    try {
        const services = await getServices(req);
        if (services == null) {
            lessonLogger.error("Unauthorized access attempt to delete lesson with ID: " + req.params.lessonId);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        const servicesId = [];
        services.map((service) => servicesId.push(service.id));
        if (servicesId.findIndex((serviceId) => Number(req.params.serviceId) === serviceId)) {
            lessonLogger.error("Unauthorized access attempt to delete lesson for service ID: " + req.params.serviceId);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        await Lessons.destroy({ where: { id: req.params.lessonId } });
        lessonLogger.info("Lesson deleted successfully with ID: " + req.params.lessonId);
        res.status(200).send("Lesson deleted successfully!");
    }
    catch (err) {
        lessonLogger.error("Failed to delete lesson with ID: " + req.params.lessonId + ". Error: " + err);
        res.status(500).send("failed to delete lesson. " + err);
    }
};
