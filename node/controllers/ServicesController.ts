import { Request, Response } from 'express';
import { Service } from '../Types';
import { Services } from '../models/AllServices';
import { serviceLogger } from '../logger';

export const getService = async (req: Request, res: Response) => {
    try {
        if (req.role !== "user") {
            serviceLogger.error("Unauthorized access attempt to get client with id: " + req.params.idNumber);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        const serviceModel = await Services.findOne({ where: { serviceName: req.params.name } });
        if (serviceModel == null) {
            serviceLogger.error("Service not found: " + req.params.name);
            res.status(500).send("failed to get service.");
        }
        else if (serviceModel.toJSON().businessId != req.business!.id) {
            serviceLogger.error("Unauthorized access attempt to service: " + req.params.name);
            res.status(403).json("You are not authorized to perform this action.");
        }
        else {
            serviceLogger.info("Service retrieved successfully: " + req.params.name);
            res.status(200).send(serviceModel.toJSON());
        }
    }
    catch (err) {
        serviceLogger.error("Error retrieving service: " + err);
        res.status(500).send("failed to get service. " + err);
    }
};

export const getServices = async (req: Request, res: Response) => {
    try {
        const services = await getServicesToServer(req);
        serviceLogger.info("Services retrieved successfully for business: " + req.params.id);
        res.status(200).send(services);
    }
    catch (err) {
        serviceLogger.error("Error retrieving services: " + err);
        res.status(500).send("failed to get services. " + err);
    }
};

export const getServicesById = async (req: Request, res: Response) => {
    try {
        const services = await getServicesToServerById(req);
        serviceLogger.info("Services retrieved successfully for business: " + req.params.id);
        res.status(200).send(services);
    }
    catch (err) {
        serviceLogger.error("Error retrieving services: " + err);
        res.status(500).send("failed to get services. " + err);
    }
};

export const getServicesToServer = async (req: Request) => {
    try {
        const servicesModel = await Services.findAll({ where: { businessId: req.business!.id } });
        const services: Service[] = servicesModel.map(service => service.get({ plain: true }));
        return services;
    }
    catch {
        return null;
    }
};

export const getServicesToServerById = async (req: Request) => {
    try {
        const servicesModel = await Services.findAll({ where: { businessId: req.params.id } });
        const services: Service[] = servicesModel.map(service => service.get({ plain: true }));
        return services;
    }
    catch {
        return null;
    }
};

export const createService = async (req: Request, res: Response) => {
    try {
        if (req.role !== "user") {
            serviceLogger.error("Unauthorized access attempt to get client with id: " + req.params.idNumber);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        const newService = req.body.newService;
        if (req.body.businessName != req.business!.businessName) {
            serviceLogger.error("Unauthorized attempt to create service for business: " + req.body.businessName);
            res.status(403).json("You are not authorized to perform this action.");
        }
        else {
            newService.businessId = req.business!.id;
            await Services.create(newService);
            serviceLogger.info("Service created successfully: " + newService.serviceName);
            res.status(200).send("Service saved successfully!");
        }
    }
    catch (err) {
        serviceLogger.error("Error creating service: " + err);
        res.status(500).send("failed to create service. " + err);
    }
};

export const updateService = async (req: Request, res: Response) => {
    try {
        if (req.role !== "user") {
            serviceLogger.error("Unauthorized access attempt to get client with id: " + req.params.idNumber);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        if (req.body.businessName != req.business!.businessName) {
            serviceLogger.error("Unauthorized attempt to update service for business: " + req.body.businessName);
            res.status(403).json("You are not authorized to perform this action.");
        }
        else {
            await Services.update(req.body.newService, { where: { serviceName: req.body.newService.serviceName } });
            serviceLogger.info("Service updated successfully: " + req.body.newService.serviceName);
            res.status(200).send("Service saved successfully!");
        }
    }
    catch (err) {
        serviceLogger.error("Error updating service: " + err);
        res.status(500).send("failed to update service. " + err);
    }
};

export const deleteService = async (req: Request, res: Response) => {
    try {
        if (req.role !== "user") {
            serviceLogger.error("Unauthorized access attempt to get client with id: " + req.params.idNumber);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        if (req.body.businessName != req.business!.businessName) {
            serviceLogger.error("Unauthorized attempt to delete service for business: " + req.body.businessName);
            res.status(403).json("You are not authorized to perform this action.");
        }
        else {
            await Services.destroy({ where: { serviceName: req.params.name } });
            serviceLogger.info("Service deleted successfully: " + req.params.name);
            res.status(200).send("Service deleted successfully!");
        }
    }
    catch (err) {
        serviceLogger.error("Error deleting service: " + err);
        res.status(500).send("failed to delete service. " + err);
    }
};