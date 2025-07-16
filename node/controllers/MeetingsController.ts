import { Request, Response } from 'express';
import { Meetings } from '../models/Meetings'
import { getServicesToServer } from './ServicesController';
import { Meeting, Service } from '../Types';
import { Op } from 'sequelize';
import { meetingLogger } from '../logger';
import { Services } from '../models/AllServices';

export const getMeetings = async (req: Request, res: Response) => {
    try {
        const services: Service[] | null = await getServicesToServer(req);
        if (services == null) {
            meetingLogger.error("Unauthorized access attempt to get meetings.");
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        const servicesId = services.map((service: Service) => service.id);
        const meetings = await Meetings.findAll({ where: { serviceId: { [Op.in]: servicesId } } });
        const meeting = meetings.map(meeting => meeting.get({ plain: true }));
        meetingLogger.info("meetings returned successfully: " + JSON.stringify(meeting));
        res.status(200).send(meeting);
    }
    catch (err) {
        meetingLogger.error("Failed to get meetings: " + err);
        res.status(500).send("failed to get meetings. " + err);
    }
}

export const getMeeting = async (req: Request, res: Response) => {
    try {
        const services: Service[] | null = await getServicesToServer(req);
        if (services == null) {
            meetingLogger.error("Unauthorized access attempt to get meeting with ID: " + req.params.meetingId);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        const servicesId = services.map((service: Service) => service.id);
        const meetingModel = await Meetings.findOne({ where: { id: req.params.meetingId, serviceId: { [Op.in]: servicesId } } });
        if (meetingModel != null) {
            const meeting = meetingModel.toJSON();
            meetingLogger.info(`Retrieved meeting with ID: ${req.params.meetingId} successfully.`);
            res.status(200).send(meeting);
        }
        else {
            meetingLogger.error("Meeting not found with ID: " + req.params.meetingId);
            res.status(500).send("failed to get meeting.");
        }
    }
    catch (err) {
        meetingLogger.error("Failed to get meeting with ID: " + req.params.meetingId + ". Error: " + err);
        res.status(500).send("failed to get meeting. " + err);
    }
}

export const createMeeting = async (req: Request, res: Response) => {
    try {
        if (req.role === 'user') {
            meetingLogger.error("Unauthorized access attempt to create meeting.");
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        req.body.newMeeting.scheduledAt = new Date(req.body.newMeeting.scheduledAt);
        req.body.newMeeting.meetingDate = new Date(req.body.newMeeting.meetingDate);
        const newMeeting: Meeting = req.body.newMeeting;
        const allMeetingsModel = await Meetings.findAll({ where: { serviceId: newMeeting.serviceId } });
        if (allMeetingsModel && allMeetingsModel.length > 0) {
            const allMeetings: Meeting[] = allMeetingsModel.map(meeting => meeting.get({ plain: true }));
        
            const overlappingMeetings: Meeting[] = [];
            for (const meeting of allMeetings) {
                const serviceModel = await Services.findOne({ where: { id: meeting.serviceId } });
                if (!serviceModel) continue;
        
                const service: Service = serviceModel.toJSON()!;
                const existingStart = new Date(meeting.meetingDate);
                const existingEnd = new Date(existingStart.getTime() + service.durationMinutes.valueOf() * 60000);
        
                const newStart = new Date(newMeeting.meetingDate);
                const newServiceModel = await Services.findOne({ where: { id: newMeeting.serviceId } });
                if (!newServiceModel) continue;
        
                const newService: Service = newServiceModel.toJSON();
                const newEnd = new Date(newStart.getTime() + newService.durationMinutes.valueOf() * 60000);
        
                const isOverlapping = newStart < existingEnd && newEnd > existingStart;
                if (isOverlapping) {
                    overlappingMeetings.push(meeting);
                }
            }
        
            if (overlappingMeetings.length > 0) {
                res.status(410).send("There is already a meeting scheduled that overlaps this time.");
                return;
            }
        }
        await Meetings.create(req.body.newMeeting);
        meetingLogger.info("Meeting created successfully with details: " + JSON.stringify(req.body.newMeeting));
        res.status(200).send("Meeting saved successfully!");
    }
    catch (err) {
        meetingLogger.error("Failed to create meeting. Error: " + err);
        res.status(500).send("failed to create meeting. " + err);
    }
}

export const updateMeeting = async (req: Request, res: Response) => {
    try {
        const services: Service[] | null = await getServicesToServer(req);
        if (services == null) {
            meetingLogger.error("Unauthorized access attempt to update meeting with ID: " + req.params.meetingId);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        const servicesId: number[] = []
        services.map((service) => servicesId.push(service.id));
        if (servicesId.findIndex((serviceId) => req.body.newMeeting.serviceId === serviceId)) {
            meetingLogger.error("Unauthorized access attempt to update meeting for service ID: " + req.body.newMeeting.serviceId);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        await Meetings.update(req.body.newMeeting, { where: { id: req.params.meetingId } });
        meetingLogger.info("Meeting updated successfully with details: " + JSON.stringify(req.body.newMeeting));
        res.status(200).send("Meeting saved successfully!");
    }
    catch (err) {
        meetingLogger.error("Failed to update meeting with ID: " + req.params.meetingId + ". Error: " + err);
        res.status(500).send("failed to update meeting. " + err);
    }
}

export const deleteMeeting = async (req: Request, res: Response) => {
    try {
        const services: Service[] | null = await getServicesToServer(req);
        if (services == null) {
            meetingLogger.error("Unauthorized access attempt to delete meeting with ID: " + req.params.meetingId);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        const servicesId: number[] = []
        services.map((service) => servicesId.push(service.id));
        if (servicesId.findIndex((serviceId) => Number(req.params.serviceId) === serviceId) === -1) {
            meetingLogger.error("Unauthorized access attempt to delete meeting for service ID: " + req.params.serviceId);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        await Meetings.destroy({ where: { id: req.params.meetingId } });
        meetingLogger.info("Meeting deleted successfully with ID: " + req.params.meetingId);
        res.status(200).send("Meeting deleted successfully!");
    }
    catch (err) {
        meetingLogger.error("Failed to delete meeting with ID: " + req.params.meetingId + ". Error: " + err);
        res.status(500).send("failed to delete meeting. " + err);
    }
}