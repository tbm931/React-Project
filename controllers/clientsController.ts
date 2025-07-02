import { Request, Response } from 'express';
import { Clients } from '../models/Clients.js'
import { clientLogger } from '../logger.js';

export const getClient = async (req: Request, res: Response) => {
    try {
        const client = await Clients.findOne({ where: { idNumber: req.params.idNumber } });
        if (client == null) {
            clientLogger.error("Client not found with id: " + req.params.idNumber);
            res.status(500).send("incorrect id");
        }
        else {
            clientLogger.info("Client found with id: " + req.params.idNumber);
            res.status(200).send(client.toJSON());
        }
    }
    catch (err) {
        clientLogger.error("Failed to get client with id: " + req.params.idNumber + ". Error: " + err);
        res.status(500).send("Failed to get client. " + err)
    }
};

export const getClients = async (req: Request, res: Response) => {
    try {
        const clients = await Clients.findAll();
        const client = clients.map(client => client.get({ plain: true }));
        clientLogger.info("Clients found: " + JSON.stringify(client));
        res.status(200).send(client);
    }
    catch (err) {
        clientLogger.error("Failed to get clients. Error: " + err);
        res.status(500).send("Failed to get clients. " + err)
    }
};

export const createClient = async (req: Request, res: Response) => {
    try {
        req.body.newClient.birthDate = new Date(req.body.newClient.birthDate);
        await Clients.create(req.body.newClient);
        clientLogger.info("Client created with id: " + req.body.newClient.idNumber);
        res.status(200).send("Client saved successfully!");
    }
    catch (err) {
        clientLogger.error("Failed to create client. Error: " + err);
        res.status(500).send("Failed to create client. " + err)
    }
};

export const updateClient = async (req: Request, res: Response) => {
    try {
        req.body.newClient.idNumber = req.params.idNumber;
        await Clients.update(req.body.newClient, { where: { idNumber: req.params.idNumber } });
        clientLogger.info("Client updated with id: " + req.params.idNumber);
        res.status(200).send("Client saved successfully!");
    }
    catch (err) {
        clientLogger.error("Failed to update client with id: " + req.params.idNumber + ". Error: " + err);
        res.status(500).send("Failed to update client. " + err)
    }
};