// collections
import OTPs from "../../frameworks/models/otp.model";

// interfaces
import IOTPRepository from "../../interface/repositories/OTP.IOTPRepository.interface";
import { IOTPDocument } from "../../interface/collections/IOTP.collections";

export default class OTPRepository implements IOTPRepository {

    async createOTP(email: string, otp: string): Promise<void | never> {
        try {
            await this.deleteOTPByEmail(email); // delete previous otp if exisits

            const newOTP: IOTPDocument = new OTPs({
                email: email,
                otp: otp,
                expiresAt: new Date(Date.now() + 90000)
            });

            await newOTP.save();
        } catch (err: any) {
            throw err;
        }
    }

    async getOTPByEmail(email: string): Promise<IOTPDocument | null | never> {
        try {
            return await OTPs.findOne({email, expiresAt: {$gte: new Date()}}).sort({expiresAt: -1});
        } catch (err: any) {
            throw err;
        }
    }

    async deleteOTPByEmail(email: string): Promise<void | never> {
        try {
            await OTPs.deleteMany({email});
        } catch (err: any) {
            throw err;
        }
    }
}