import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
const jwtSecretKey = "r8#Vm92!hD3@kLz0Wq";
export const protect = asyncHandler(async (req, res, next) => {
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
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const userBusiness = jwt.verify(token, jwtSecretKey);
            req.user = userBusiness.user;
            req.business = userBusiness.business;
            req.role = userBusiness.role;
            next();
        }
        catch (error) {
            res.status(401).json("Not Authorized. " + error);
        }
    }
    if (!token && req.path != '/signUp' && !req.path.includes('/signIn')) {
        res.status(401).json("Not Authorized, no token.");
    }
});
