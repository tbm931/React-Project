export enum status {
    Scheduled = 0,
    Canceled = 1,
    Completed = 2
}

export type User = {
    id: Number,
    userName: String,
    idNumber: String,
    pw: string
};

export type UserForToken = {
    userId: String,
    password: String
};

export type Service = {
    id: Number,
    serviceName: String,
    serviceDescription: String,
    durationMinutes: Number,
    price: Number,
    isActive: Boolean,
    businessId: Number
};

export type Client = {
    id: Number,
    idNumber: String,
    clientName: String,
    birthDate: Date,
    phone: String,
    email: String,
    notes: String,
};

export type Lesson = {
    id: Number,
    clientId: Number,
    serviceId: number,
    scheduledAt: Date,
    durationMinutes: number,
    lessonStatus: status,
    notes: string,
    priceAtTime: number,
    lessonDate: Date,
};

export type UserBusiness = {
    user: User,
    business: Business
};

export type BusinessResponse = {
    message: "success" | "fail",
    business: Business,
    error: String | Error
};

export type SigninResponse = {
    message: "success" | "fail",
    user: User,
    token: string,
    error: String | Error
};

export type Business = {
    id: Number,
    businessName: String,
    userId: Number,
    email: String,
    phone: String,
    businessAddress: String,
    details: String
}

declare global {
    namespace Express {
        interface Request {
            user?: User | null;
            business?: Business | null;
        }
    }
}