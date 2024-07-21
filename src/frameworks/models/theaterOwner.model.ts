import mongoose, { Schema } from "mongoose";
import { ITheaterOwnerCollection, ITheaterOwnerDocument } from "../../interface/collections/ITheaterOwner.collection";

const theaterOwnerSchema: Schema = new Schema<ITheaterOwnerDocument>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    idProof: {
        type: String,
        required: true
    },
    OTPVerificationStatus: {
        type: Boolean,
        default: false,
        required: true
    },
    documentVerificationStatus: {
        type: Boolean,
        default: false,
        required: true
    },
    idProofUpdateVerificationStatus: {
        type: Boolean,
        default: false,
        required: true
    },
    idProofUpdateDocument: {
        type: String,
        required: false
    }
});

const TheaterOwners: ITheaterOwnerCollection = mongoose.model<ITheaterOwnerDocument>('TheaterOwners', theaterOwnerSchema);

export default TheaterOwners;