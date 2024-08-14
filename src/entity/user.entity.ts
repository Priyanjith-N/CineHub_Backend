export default interface IUser {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    OTPVerification: boolean;
    isBlocked: boolean;
}