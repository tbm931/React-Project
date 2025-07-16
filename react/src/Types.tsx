export type SigninResponse = {
    message: "success" | "fail",
    user: User | Client,
    token: string,
    error: String | Error,
    role: "user" | "client",
    business: Business | null
};

export type User = {
    id: Number,
    userName: string,
    idNumber: string,
    pw: string
};

export type Business = {
    id: Number,
    businessName: string,
    userId: Number,
    email: string,
    phone: string,
    businessAddress: string,
    details: string
}

export type Service = {
    id: number,
    serviceName: string,
    serviceDescription: string,
    durationMinutes: number,
    price: number,
    isActive: boolean,
    businessId: number
};

export enum Status {
    Scheduled = "Scheduled",
    Canceled = "Canceled",
    Completed = "Completed"
}

export type Meeting = {
    id: Number,
    clientId: Number,
    serviceId: number,
    scheduledAt: Date,
    meetingStatus: Status,
    notes: string,
    meetingDate: Date,
};

export type MeetingWithoutId = {
    clientId: Number,
    serviceId: number,
    scheduledAt: Date,
    meetingStatus: Status,
    notes: string,
    meetingDate: Date,
};

export type Client = {
    id: Number,
    idNumber: string,
    clientName: string,
    birthDate: Date,
    phone: string,
    email: string,
    notes: string,
    pw: String
};

export type businessDetails = {
    id: Number,
    businessName: String,
    email: String,
    phone: String,
    businessAddress: String,
    details: String
};

export type userForSignUp = {
    newUser:
    {
        userName: string,
        idNumber: string,
        pw: string
    }
    newBusiness: {
        businessName: string,
        userId: Number,
        email: string,
        phone: string,
        businessAddress: string,
        details: string
    }
}

export type ClientWithoutId = {
    idNumber: String,
    clientName: String,
    birthDate: Date,
    phone: String,
    email: String,
    notes: String,
    pw: String
}

export type ServiceWithoutId = {
    serviceName: string,
    serviceDescription: string,
    durationMinutes: number,
    price: number,
    isActive: boolean,
    businessId: number
};