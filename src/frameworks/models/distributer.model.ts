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
    licenceUpdateVerificationStatus: {
        type: Boolean,
        default: false,
        required: true
    },
    licenceUpdateDocument: {
        type: String,
        required: false
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

const Distributers: IDistributerCollection = mongoose.model<IDistributerDocument>('Distributers', distributerSchema);

export default Distributers;