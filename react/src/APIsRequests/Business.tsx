import type { AxiosResponse } from "axios";
import type { Business, businessDetails } from "../Types";
import { api } from "./Generate";

export const getBusiness: (id?: number) => Promise<Business> = async (id?: number) => {
    try {
        if (id) {
            const res: AxiosResponse = await api.get(`/business/${id}`);
            return res.data;
        }
        const res: AxiosResponse = await api.get("/business");
        console.log("res " + res.data);

        return res.data;
    }
    catch (error) {
        console.error('Unable to get item. ', error);
        return {
            businessAddress: "",
            businessName: "",
            details: "",
            email: "",
            id: 0,
            phone: "",
            userId: 0
        }
    }
}

export const putBusiness: (business: Business) => Promise<String> = async (business: Business) => {
    try {
        const response: AxiosResponse = await api.put("/business", { newBusiness: business });
        return response.data;
    }
    catch (error) {
        console.error("Unable to update item. " + error);
    }
    return "";
}

export const getBusinesses: () => Promise<businessDetails[]> = async () => {
    try {
        const res: AxiosResponse = await api.get("/business/all/");
        return res.data;
    }
    catch (error) {
        console.error('Unable to get items. ', error);
    }
}