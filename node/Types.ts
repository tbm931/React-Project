export enum Status {
    Scheduled = "Scheduled",
    Canceled = "Canceled",
    Completed = "Completed"
}

export type User = {
    id: number,
    userName: string,
    idNumber: string,
    pw: string
};

export type UserForToken = {
    userId: string,
    password: string
};

export type Service = {
    id: number,
    serviceName: string,
    serviceDescription: string,
    durationMinutes: number,
    price: number,
    isActive: boolean,
    businessId: number
};

export type Client = {
    id: number,
    idNumber: string,
    clientName: string,
    birthDate: Date,
    phone: string,
    email: string,
    notes: string,
    pw: string
};

export type Meeting = {
    id: number,
    clientId: number,
    serviceId: number,
    scheduledAt: Date,
    meetingStatus: Status,
    notes: string,
    meetingDate: Date,
};

export type UserBusiness = {
    user: User | Client,
    role: "user" | "client",
    business?: Business
};

export type BusinessResponse = {
    message: "success" | "fail",
    business: Business,
    error: string | Error
};

export type SigninResponse = {
    message: "success" | "fail",
    user: User | Client,
    token: string,
    error: string | Error,
    role: "user" | "client",
    business: Business | null
};

export type Business = {
    id: number,
    businessName: string,
    userId: number,
    email: string,
    phone: string,
    businessAddress: string,
    details: string
}

export type businessDetails = {
    id: number,
    businessName: string,
    email: string,
    phone: string,
    businessAddress: string,
    details: string
}

declare global {
    namespace Express {
        interface Request {
            user?: User | Client| null;
            business?: Business | null;
            role?: "user" | "client" | null;
        }
    }
}