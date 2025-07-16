import { deleteUser } from './UsersController.js';
import { Business as businessModel } from '../models/Business.js';
import { Users } from '../models/Users.js';
import { businessLogger, userLogger } from '../logger.js';
export const getBusiness = async (req, res) => {
    if (req.role !== "user") {
        businessLogger.error("Unauthorized access attempt to get business: " + JSON.stringify(req.business));
        res.status(403).json("You are not authorized to perform this action.");
        return;
    }
    businessLogger.info("getBusiness called with params: " + JSON.stringify(req.business));
    res.json(req.business);
};
export const getBusinessByID = async (req, res) => {
    try {
        if (req.role === "user") {
            businessLogger.error("Unauthorized access attempt to get business: " + req.params.id);
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        const businessMode = await businessModel.findOne({ where: { id: req.params.id } });
        if (businessMode != null) {
            businessLogger.info("getBusiness called with params: " + req.params.id);
            res.json(businessMode.toJSON());
        }
        else {
            businessLogger.error("Business not found with id: " + req.params.id);
            res.status(500).send("incorrect id");
        }
    }
    catch (err) {
        businessLogger.error("Failed to get business with id: " + req.params.id + ". Error: " + err);
        res.status(500).send("Failed to get business with id: " + req.params.id + ". Error: " + err);
    }
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
        const businessMode = await businessModel.findOne({ where: { userId: userModel === null || userModel === void 0 ? void 0 : userModel.toJSON().id } });
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
        if (req.role !== "user") {
            businessLogger.error("Unauthorized access attempt to update business: " + JSON.stringify(req.business));
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
        const business = {
            businessAddress: req.body.newBusiness.businessAddress,
            businessName: req.body.newBusiness.businessName,
            details: req.body.newBusiness.details,
            email: req.body.newBusiness.email,
            id: req.business.id,
            phone: req.body.newBusiness.phone,
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
        if (req.role !== "user") {
            businessLogger.error("Unauthorized access attempt to delete business: " + JSON.stringify(req.business));
            res.status(403).json("You are not authorized to perform this action.");
            return;
        }
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
export const getBusinessesDetails = async (req, res) => {
    try {
        const businessMode = await businessModel.findAll();
        if (businessMode != null) {
            const businesses = businessMode.map(business => business.toJSON());
            const bussinessesDetails = businesses.map(business => ({
                id: business.id,
                businessName: business.businessName,
                email: business.email,
                phone: business.phone,
                businessAddress: business.businessAddress,
                details: business.details
            }));
            businessLogger.info("Businesses details retrieved successfully");
            res.status(200).json(bussinessesDetails);
        }
        else {
            businessLogger.info("No businesses found");
            res.status(200).json([]);
        }
    }
    catch (err) {
        businessLogger.error("Failed to retrieve businesses names: " + err);
        res.status(500).send("failed to retrieve businesses names. " + err);
    }
};
