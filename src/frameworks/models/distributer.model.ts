import mongoose, { Schema } from "mongoose";
import { IDistributerCollection, IDistributerDocument } from "../../interface/collections/IDistributer.collection";

const distributerSchema: Schema = new Schema<IDistributerDocument>({
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
    licence: {
        publicId: { type: String, required: true },
        imageURL: { type: String, required: true },
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
    distributedMoviesList: [
        {
            type: Schema.Types.ObjectId
        }
    ],
    isBlocked: {
        type: Boolean,
        required: true,
        default: false
    }
});

const Distributers: IDistributerCollection = mongoose.model<IDistributerDocument>('Distributers', distributerSchema);

export default Distributers;