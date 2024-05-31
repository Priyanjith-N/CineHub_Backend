import { ObjectId } from "mongoose";

export default interface IUser {
    _id: ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    OTPVerification: boolean;
    password?: string;
}