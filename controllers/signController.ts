import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { BusinessResponse, SigninResponse, User, UserBusiness } from '../Types.js';
import { Users } from '../models/Users.js';
import { createBusiness, getBusinessSignIn } from './businessController.js';
import { userLogger,businessLogger } from '../logger.js';

const signInPrivate: (Request: Request, Response: Response) => Promise<SigninResponse> = async (req: Request, res: Response) => {
    const response: SigninResponse = { message: "fail", user: { userName: "", idNumber: "", pw: "", id: 0 }, token: "", error: "userName not exist" };
    const findUserModel = await Users.findOne({ where: { userName: req.body.userName } });
    if (findUserModel == null){
        userLogger.error("User not found: " + req.body.userName);
        return response;
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
        const BusinessResponse: BusinessResponse = await getBusinessSignIn(user.userName,user.id);
        if (BusinessResponse.message == "fail") {
            response.error = BusinessResponse.error;
            businessLogger.error("Failed to get business for user: " + user.userName + ". Error: " + BusinessResponse.error);
            return response;
        }
        const userBusiness:UserBusiness = {
            user: user,
            business: BusinessResponse.business
        }
        const token = jwt.sign(userBusiness, jwtSecretKey);
        response.message = "success";
        response.user = user;
        response.token = token;
    }
    userLogger.info("User sign in attempt: " + req.body.userName + " - " + (response.message === "success" ? "Success" : "Failed"));
    return response;
};

export const signUp: (req: Request, res: Response) => Promise<void> = async (req: Request, res: Response) => {    
    try {
        const hashedPassword = await bcrypt.hash(req.body.newUser.pw, 10);
        req.body.newUser.pw = hashedPassword;
        const createdUser = await Users.create(req.body.newUser);
        req.body.newBusiness.userId = createdUser.toJSON().id;
        await createBusiness(req, res);
    }
    catch (err) {
        userLogger.error("Failed to create user: " + req.body.newUser.userName + ". Error: " + err);
        res.status(500).send("Failed to create user. " + err);
    }
};

export const signIn: (req: Request, res: Response) => Promise<void> = async (req: Request, res: Response) => {
    signInPrivate(req, res).then((result: SigninResponse) => {
        if (result.message === "success") {
            res.send(result.token);
            return;
        }
    });
}