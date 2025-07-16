import type { AxiosResponse } from "axios";
import type { ClientWithoutId, SigninResponse, userForSignUp } from "../Types";
import { api } from "./Generate";

export const login = async (name: string, password: string): Promise<SigninResponse> => {
    try {
        const res = await api.post("/signIn", {
            userName: name,
            password: password
        });
        return res.data;
    } catch (error) {
        console.error('Unable to sign in.', error);
        return {
            user: {
                idNumber: "",
                userName: "",
                pw: "",
                id: 0
            },
            message: "fail",
            token: "",
            business: null,
            error: "",
            role: "client"
        };
    }
};

export const signUp: (newUser: userForSignUp | ClientWithoutId, role: 'user' | 'client') => Promise<String> = async (newUser: userForSignUp | ClientWithoutId, role: 'user' | 'client') => {
    try {
        let body;
        if ("newBusiness" in newUser) {
            body = {
                newUser: (newUser as any).newUser,
                newBusiness: (newUser as any).newBusiness,
                role: role
            };
        } else {
            body = {
                newUser: newUser,
                role: role
            };
        }

        const res: AxiosResponse = await api.post("/signUp", body);
        return res.data;
    }
    catch (error) {
        console.error('Unable to sign up. ', error);
    }
}