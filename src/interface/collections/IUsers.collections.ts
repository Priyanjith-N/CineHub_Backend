import { Document, Model, ObjectId } from "mongoose";

export interface IUserDocument extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    OTPVerification: boolean;
    isBlocked: boolean;
}


export interface IUsersCollection extends Model<IUserDocument> {}