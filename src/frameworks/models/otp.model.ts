import mongoose, { Schema } from "mongoose";
import { IOTPCollection, IOTPDocument } from "../../interface/collections/IOTP.collections";

const otpSchema: Schema =  new Schema({
    otp: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: new Date(Date.now() + 90000),
        required: true
    }
});




const OTPs: IOTPCollection = mongoose.model<IOTPDocument>('OTPs', otpSchema);

export default OTPs;