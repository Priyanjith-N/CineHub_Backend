import { Document, Model, ObjectId } from "mongoose";

export interface IOTPDocument extends Document {
    _id: ObjectId;
    otp: String;
    email: String;
    expiresAt: Date;
}

export interface IOTPCollection extends Model<IOTPDocument> {}