import mongoose, { Schema } from "mongoose";

// interfaces
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
        required: true
    }
});




const OTPs: IOTPCollection = mongoose.model<IOTPDocument>('OTPs', otpSchema);

export default OTPs;