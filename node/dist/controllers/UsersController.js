import { Users } from '../models/Users.js';
import bcrypt from 'bcrypt';
import { userLogger } from '../logger.js';
export const getUser = async (req, res) => {
    if (req.role !== "user") {
        userLogger.error("Unauthorized access attempt to get client with id: " + req.params.idNumber);
        res.status(403).json("You are not authorized to perform this action.");
        return;
    }
    if (req.user.idNumber != req.params.idNumber) {
        userLogger.error("User " + req.user.id + " tried to get user " + req.params.idNumber);
        res.status(403).json("You are not authorized to perform this action.");
    }
    else {
        userLogger.info("User " + req.user.id + " got user " + req.params.idNumber);
        res.status(200).send(req.user);
    }
};
// export const getUsers = async (req: Request, res: Response) => {
//     try {
//         const users = await Users.findAll();
//         res.status(200).send(users.map(user => user.get({ plain: true })));
//     }
//     catch (err) {
//         res.status(500).send("Failed to get users. " + err)
//     }
// };
export const updateUser = async (req, res) => {
    try {
        if (req.role !== "user") {
            userLogger.error("Unauthorized access attempt to get client with id: " + req.params.idNumber);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        if (req.body.newUser.idNumber != req.user.idNumber) {
            userLogger.error("User " + req.user.id + " tried to update user " + req.params.idNumber);
            res.status(403).json("You are not authorized to perform this action.");
        }
        else {
            const hashedPassword = await bcrypt.hash(req.body.newUser.pw, 10);
            req.body.newUser.pw = hashedPassword;
            await Users.update(req.body.newUser, { where: { idNumber: req.params.idNumber } });
            req.user = req.body.newUser;
            userLogger.info("User " + req.user.id + " updated user " + req.params.idNumber);
            res.status(200).send("User saved successfully!");
        }
    }
    catch (err) {
        userLogger.error("Failed to update user: " + err);
        res.status(500).send("failed to update user. " + err);
    }
};
export const deleteUser = async (req, res) => {
    try {
        if (req.role !== "user") {
            userLogger.error("Unauthorized access attempt to get client with id: " + req.params.idNumber);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        if (Number(req.params.idNumber) != req.user.id) {
            userLogger.error("User " + req.user.id + " tried to delete user " + req.params.idNumber);
            res.status(403).json("You are not authorized to perform this action.");
        }
        else {
            await Users.destroy({ where: { id: req.params.idNumber } });
            userLogger.info("User " + req.user.id + " deleted user " + req.params.idNumber);
            res.status(200).send("User was deleted successfully!");
            req.user.id = 0;
            req.user.idNumber = "999999999";
            req.user.pw = "";
        }
    }
    catch (err) {
        userLogger.error("Failed to delete user: " + err);
        res.status(500).send("failed to delete user. " + err);
    }
};
