import { Document, Model, ObjectId } from "mongoose";

export interface ITheaterOwnerDocument extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    idProof: string;
    idProofImage: string[];
    OTPVerificationStatus: boolean;
    documentVerificationStatus: boolean;
    idProofUpdateVerificationStatus: boolean;
    idProofUpdateDocumentImage: string[] | null | undefined;
    isBlocked: boolean;
}

export interface ITheaterOwnerCollection extends Model<ITheaterOwnerDocument> {}