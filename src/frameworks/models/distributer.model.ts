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
            type: String,
            required: true
        }
    ],
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
    licenceUpdateDocument: {
        type: String,
        required: false
    },
    licenceUpdateVerificationStatus: {
        type: Boolean,
        default: false,
        required: true
    },
    idProofUpdateVerificationStatus: {
        type: Boolean,
        default: false,
        required: true
    },
    idProofUpdateDocumentImage: [
        {
            type: String,
            required: false
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