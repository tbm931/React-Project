import { type Service, type ServiceWithoutId } from "../Types";
import { type AxiosResponse } from "axios";
import { api } from "./Generate";

export const getServices: () => Promise<Service[]> = async () => {
    try {
        const response: AxiosResponse<Service[]> = await api.get("/services");
        return response.data;
    }
    catch (error) {
        console.error('Unable to get items. ' + error);
    }
    return [];
}

export const getServicesById: (id: number) => Promise<Service[]> = async (id: number) => {
    try {
        const response: AxiosResponse<Service[]> = await api.get(`/services/${id}`);
        return response.data;
    }
    catch (error) {
        console.error('Unable to get items. ' + error);
    }
    return [];
}

export const putService: (updateService: Service, businessName: String) => Promise<void> = async (updateService: Service, businessName: String) => {
    try {
        const response: AxiosResponse = await api.put(`/services`, { newService: updateService, businessName: businessName });
        return response.data;
    }
    catch (error) {
        console.error('Unable to update item. ' + error);
    }
    return null;
}

export const postService: (newServiceWithId: Service, businessName: String) => Promise<void> = async (newServiceWithId: Service, businessName: String) => {
    try {
        const newService: ServiceWithoutId = {
            businessId: newServiceWithId.businessId,
            durationMinutes: newServiceWithId.durationMinutes,
            isActive: newServiceWithId.isActive,
            price: newServiceWithId.price,
            serviceDescription: newServiceWithId.serviceDescription,
            serviceName: newServiceWithId.serviceName
        }
        const response: AxiosResponse = await api.post("/services", { newService: newService, businessName: businessName });
        return response.data;
    }
    catch (error) {
        console.error('Unable to add item. ' + error);
    }
    return null;
}