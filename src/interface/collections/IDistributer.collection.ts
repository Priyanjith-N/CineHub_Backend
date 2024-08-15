import { Document, Model, ObjectId } from "mongoose";
import IImage from "../common/IImage.interface";

export interface IDistributerDocument extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    licence: IImage;
    idProof: string;
    idProofImage: IImage[];
    OTPVerificationStatus: boolean;
    documentVerificationStatus: string;
    distributedMoviesList: string[],
    isBlocked: boolean;
}

export interface IDistributerCollection extends Model<IDistributerDocument> {}