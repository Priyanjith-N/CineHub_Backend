import { Document, Model, ObjectId } from "mongoose";

export interface IDistributerDocument extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    licence: string;
    idProof: string;
    idProofImage: string[];
    OTPVerificationStatus: boolean;
    documentVerificationStatus: string;
    distributedMoviesList: string[],
    licenceUpdateDocument: string | undefined | null
    licenceUpdateVerificationStatus: boolean;
    idProofUpdateVerificationStatus: boolean;
    idProofUpdateDocumentImage: string[] | undefined | null;
    isBlocked: boolean;
}

export interface IDistributerCollection extends Model<IDistributerDocument> {}