import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Users } from '../models/Users.js';
import { createBusiness, getBusinessSignIn } from './businessController.js';
import { userLogger, businessLogger } from '../logger.js';
const signInPrivate = async (req, res) => {
    const response = { message: "fail", user: { userName: "", idNumber: "", pw: "", id: 0 }, token: "", error: "userName not exist" };
    const findUserModel = await Users.findOne({ where: { userName: req.body.userName } });
    if (findUserModel == null) {
        userLogger.error("User not found: " + req.body.userName);
        return response;
    }
    const findUser = findUserModel.toJSON();
    const isMatch = await bcrypt.compare(req.body.password, findUser.pw);
    if (isMatch) {
        const jwtSecretKey = "r8#Vm92!hD3@kLz0Wq";
        const user = {
            userName: findUser.userName,
            pw: findUser.pw,
            idNumber: findUser.idNumber,
            id: findUser.id
        };
        const BusinessResponse = await getBusinessSignIn(user.userName, user.id);
        if (BusinessResponse.message == "fail") {
            response.error = BusinessResponse.error;
            businessLogger.error("Failed to get business for user: " + user.userName + ". Error: " + BusinessResponse.error);
            return response;
        }
        const userBusiness = {
            user: user,
            business: BusinessResponse.business
        };
        const token = jwt.sign(userBusiness, jwtSecretKey);
        response.message = "success";
        response.user = user;
        response.token = token;
    }
    userLogger.info("User sign in attempt: " + req.body.userName + " - " + (response.message === "success" ? "Success" : "Failed"));
    return response;
};
export const signUp = async (req, res) => {
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
export const signIn = async (req, res) => {
    signInPrivate(req, res).then((result) => {
        if (result.message === "success") {
            res.send(result.token);
            return;
        }
    });
};
