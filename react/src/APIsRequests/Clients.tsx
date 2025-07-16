import { type Client } from "../Types";
import { type AxiosResponse } from "axios";
import { api } from "./Generate";

export const getClients: () => Promise<Client[]> = async () => {
    try {
        const response: AxiosResponse<Client[]> = await api.get("/clients");
        return response.data;
    }
    catch (error) {
        console.error('Unable to get items. ' + error);
    }
    return [];
}