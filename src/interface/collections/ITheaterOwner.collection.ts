import { Document, Model, ObjectId } from "mongoose";
import IImage from "../common/IImage.interface";

export interface ITheaterOwnerDocument extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    idProof: string;
    idProofImage: IImage[];
    OTPVerificationStatus: boolean;
    documentVerificationStatus: string;
    isBlocked: boolean;
}

export interface ITheaterOwnerCollection extends Model<ITheaterOwnerDocument> {}