import type { AxiosResponse } from "axios";
import type { User } from "../Types";
import { api } from "./Generate";

export const getUser: (userId: Number) => Promise<User> = async (userId: Number) => {
    let response: User = {
        id: 0,
        idNumber: "",
        pw: "",
        userName: ""
    }
    try {
        const res: AxiosResponse = await api.get(`/users/${userId}`);
        response = res.data;
    }
    catch (error) {
        console.error('Unable to get item. ', error);
    }
    return response;
}