export default interface IUser {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    OTPVerification: boolean;
    isBlocked: boolean;
}

export interface IUserProfile {
    name: string;
    email: string;
    phoneNumber: string;
}

export interface ICreateCheckoutSessionCredentials {
    scheduleId: string | undefined;
    selectedSeats: { rowIdx: number; colIdx: number; }[] | undefined;
}

export interface IBookSeatCredentials extends ICreateCheckoutSessionCredentials {
    userId: string | undefined;
    sessionId: string | undefined;
}