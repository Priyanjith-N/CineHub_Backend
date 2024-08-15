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
    password: {
        type: String,
        required: true
    },
    idProof: {
        type: String,
        enum: ["Aadhar Card", "PAN Card"],
        required: true
    },
    idProofImage: [
        {
            publicId: { type: String, required: true },
            imageURL: { type: String, required: true }
        }
    ],
    OTPVerificationStatus: {
        type: Boolean,
        default: false,
        required: true
    },
    documentVerificationStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
        required: true
    },
    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    }
});

const TheaterOwners: ITheaterOwnerCollection = mongoose.model<ITheaterOwnerDocument>('TheaterOwners', theaterOwnerSchema);

export default TheaterOwners;