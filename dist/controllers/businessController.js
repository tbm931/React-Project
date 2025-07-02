import { deleteUser } from './UsersController.js';
import { Business as businessModel } from '../models/Business.js';
import { Users } from '../models/Users.js';
import { businessLogger, userLogger } from '../logger.js';
export const getBusiness = async (req, res) => {
    businessLogger.info("getBusiness called with params: " + JSON.stringify(req.business));
    res.json(req.business);
};
export const getBusinessSignIn = async (userName, userId) => {
    const response = {
        business: {
            businessAddress: "",
            businessName: "",
            details: "",
            email: "",
            id: 0,
            phone: "",
            userId: userId
        },
        message: 'fail',
        error: "user id is not exist."
    };
    try {
        const userModel = await Users.findOne({ where: { userName: userName } });
        const businessMode = await businessModel.findOne({ where: { userId: userModel?.toJSON().id } });
        if (businessMode != null) {
            const findBusiness = businessMode.toJSON();
            response.business.businessAddress = findBusiness.businessAddress;
            response.business.businessName = findBusiness.businessName;
            response.business.details = findBusiness.details;
            response.business.email = findBusiness.email;
            response.business.id = findBusiness.id;
            response.business.phone = findBusiness.phone;
            response.business.userId = findBusiness.userId;
            response.error = "";
            response.message = "success";
        }
    }
    catch (err) {
        response.error = "failed to get business. " + err;
    }
    if (response.error != "")
        businessLogger.info("getBusinessSignIn response: " + JSON.stringify(response));
    else
        businessLogger.error("getBusinessSignIn error: " + response.error);
    return response;
};
export const createBusiness = async (req, res) => {
    try {
        await businessModel.create(req.body.newBusiness);
        businessLogger.info("Business created successfully: " + JSON.stringify(req.body.newBusiness));
        userLogger.info("User created successfully: " + JSON.stringify(req.body.newUser));
        res.status(200).send("Business and user saved successfully!");
    }
    catch (err) {
        businessLogger.error("Failed to create business: " + err);
        userLogger.error("Failed to create user: " + err);
        res.status(500).send("failed to create business. " + err);
    }
};
export const updateBusiness = async (req, res) => {
    try {
        const businessFromParams = JSON.parse(req.body.newBusiness);
        const business = {
            businessAddress: businessFromParams.businessAddress,
            businessName: businessFromParams.businessName,
            details: businessFromParams.details,
            email: businessFromParams.email,
            id: req.business.id,
            phone: businessFromParams.phone,
            userId: req.user.id
        };
        await businessModel.update(business, { where: { id: req.business.id } });
        businessLogger.info("Business updated successfully: " + JSON.stringify(business));
        res.status(200).send("Business saved successfully!");
    }
    catch (err) {
        businessLogger.error("Failed to update business: " + err);
        res.status(500).send("failed to update business. " + err);
    }
};
export const deleteBusiness = async (req, res) => {
    try {
        await businessModel.destroy({ where: { id: req.params.id } });
        req.params.idNumber = req.business.userId.toString();
        req.business.businessAddress = "";
        req.business.businessName = "";
        req.business.details = "";
        req.business.email = "";
        req.business.id = 0;
        req.business.phone = "";
        req.business.userId = 0;
        await deleteUser(req, res);
        businessLogger.info("Business deleted successfully: " + req.params.id);
        res.status(200).send("Business deleted successfully!");
    }
    catch (err) {
        if (!res.headersSent) {
            businessLogger.error("Failed to delete business: " + err);
            res.status(500).send("failed to delete Business. " + err);
        }
    }
};
