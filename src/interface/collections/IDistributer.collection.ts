import { Model, ObjectId } from "mongoose";

export interface IDistributerDocument extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    licence: string;
    idProof: string;
    OTPVerificationStatus: boolean;
    documentVerificationStatus: boolean;
    licenceUpdateVerificationStatus: boolean;
    licenceUpdateDocument: string | null | undefined;
    idProofUpdateVerificationStatus: boolean;
    idProofUpdateDocument: string | null | undefined;
}

export interface IDistributerCollection extends Model<IDistributerDocument> {}