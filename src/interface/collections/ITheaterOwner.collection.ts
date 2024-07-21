import { Model, ObjectId } from "mongoose";

export interface ITheaterOwnerDocument extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    idProof: string;
    OTPVerificationStatus: boolean;
    documentVerificationStatus: boolean;
    idProofUpdateVerificationStatus: boolean;
    idProofUpdateDocument: string | null | undefined;
}

export interface ITheaterOwnerCollection extends Model<ITheaterOwnerDocument> {}