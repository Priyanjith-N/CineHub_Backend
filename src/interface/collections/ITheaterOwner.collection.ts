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
    documentVerificationStatus: string;
    idProofUpdateVerificationStatus: boolean;
    idProofUpdateDocumentImage: string[] | null | undefined;
    isBlocked: boolean;
}

export interface ITheaterOwnerCollection extends Model<ITheaterOwnerDocument> {}