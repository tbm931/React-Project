import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { BusinessResponse, Client, SigninResponse, User, UserBusiness } from '../Types.js';
import { Users } from '../models/Users.js';
import { createBusiness, getBusinessSignIn } from './BusinessController.js';
import { userLogger, businessLogger } from '../logger.js';
import { Clients } from '../models/Clients.js';

const signInPrivate: (Request: Request) => Promise<SigninResponse> = async (req: Request) => {
    const response: SigninResponse = { message: "fail", user: { userName: "", idNumber: "", pw: "", id: 0 }, token: "", error: "userName not exist", role: 'client',business: null };
    const findUserModel = await Users.findOne({ where: { userName: req.body.userName } });
    if (findUserModel == null) {
        const findClientModel = await Clients.findOne({ where: { clientName: req.body.userName } });
        if (findClientModel != null) {
            const findClient: Client = findClientModel.toJSON();
            const isMatch = await bcrypt.compare(req.body.password, findClient.pw);
            if (isMatch) {
                const jwtSecretKey = "r8#Vm92!hD3@kLz0Wq";
                const client: Client = {
                    clientName: findClient.clientName,
                    birthDate: findClient.birthDate,
                    email: findClient.email,
                    notes: findClient.notes,
                    phone: findClient.phone,
                    pw: findClient.pw,
                    idNumber: findClient.idNumber,
                    id: findClient.id,
                };
                const userBusiness: UserBusiness = {
                    user: client,
                    role: 'client'
                }
                const token = jwt.sign(userBusiness, jwtSecretKey);
                response.message = "success";
                response.user = client;
                response.token = token;
                response.role = 'client';
            }
            userLogger.info("Client sign in attempt: " + req.body.userName + " - " + (response.message === "success" ? "Success" : "Failed"));            
            return response;
        }
        else {
            userLogger.error("User or client not found: " + req.body.userName);
            return response;
        }
    }
    const findUser: User = findUserModel.toJSON();
    const isMatch = await bcrypt.compare(req.body.password, findUser.pw);
    if (isMatch) {
        const jwtSecretKey = "r8#Vm92!hD3@kLz0Wq";
        const user: User = {
            userName: findUser.userName,
            pw: findUser.pw,
            idNumber: findUser.idNumber,
            id: findUser.id
        };
        const BusinessResponse: BusinessResponse = await getBusinessSignIn(user.userName, user.id);
        if (BusinessResponse.message == "fail") {
            response.error = BusinessResponse.error;
            businessLogger.error("Failed to get business for user: " + user.userName + ". Error: " + BusinessResponse.error);
            return response;
        }
        const userBusiness: UserBusiness = {
            user: user,
            business: BusinessResponse.business,
            role: 'user'
        }
        const token = jwt.sign(userBusiness, jwtSecretKey);
        response.message = "success";
        response.user = user;
        response.token = token;
        response.role = 'user';
        response.business = BusinessResponse.business;
    }
    userLogger.info("User sign in attempt: " + req.body.userName + " - " + (response.message === "success" ? "Success" : "Failed"));
    return response;
};

export const signUp: (req: Request, res: Response) => Promise<void> = async (req: Request, res: Response) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.newUser.pw, 10);
        req.body.newUser.pw = hashedPassword;
        if (req.body.role === 'client') {
            await Clients.create(req.body.newUser);
            userLogger.info("Client created: " + req.body.newUser.clientName);
            res.status(200).send("Client created successfully.");
            return;
        }
        const createdUser = await Users.create(req.body.newUser);
        req.body.newBusiness.userId = createdUser.toJSON().id;
        await createBusiness(req, res);
    }
    catch (err) {
        userLogger.error("Failed to create user or client: " + req.body.newUser.userName + ". Error: " + err);
        res.status(500).send("Failed to create user or client. " + err);
    }
};

export const signIn: (req: Request, res: Response) => Promise<void> = async (req: Request, res: Response) => {
    signInPrivate(req).then((result: SigninResponse) => {
        if (result.message === "success") {
            res.send(result);
            return;
        }
        else {
            res.status(401).send(result);
            return;
        }
    });
}