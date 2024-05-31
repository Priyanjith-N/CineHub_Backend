import { Document, Model, ObjectId } from "mongoose";

export interface IUserDocument extends Document {
    _id: ObjectId;
    name: String;
    email: String;
    phoneNumber: String;
    password: String;
    OTPVerification: Boolean;
}


export interface IUsersCollection extends Model<IUserDocument> {}