import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { UserBusiness } from '../Types.js';
import { Request, Response, NextFunction } from 'express';
const jwtSecretKey = "r8#Vm92!hD3@kLz0Wq";

// export const currentBusiness: Business = {
//     businessAddress: "",
//     businessName: "",
//     details: "",
//     email: "",
//     id: 0,
//     phone: "",
//     userId: 0
// };

// export const currentUser: User = {
//     userName: "",
//     idNumber: "999999999",
//     pw: "",
//     id: 0
// };

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (req.path.includes('/signIn')) {
        next();
        return;
    }
    if (req.path === '/signUp') {
        next();
        return;
    }
    let token;

    if (req.path != '/signUp' && !req.path.includes('/signIn') &&
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const userBusiness: UserBusiness = jwt.verify(token, jwtSecretKey) as JwtPayload as UserBusiness;
            req.user = userBusiness.user;
            req.business = userBusiness.business;
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json("Not Authorized. " + error);
        }
    }
    if (!token && req.path != '/signUp' && !req.path.includes('/signIn')) {
        res.status(401).json("Not Authorized, no token.");
    }
});