// interfaces
import { ITheaterOwnerCollection, ITheaterOwnerDocument } from "../../interface/collections/ITheaterOwner.collection";
import { IOTPCollection, IOTPDocument } from "../../interface/collections/IOTP.collections";
import ITheaterOwnerAuthRepository from "../../interface/repositories/theaterOwner.IAuth.repository";
import { ITheaterOwnerRegisterCredentials } from "../../interface/controllers/theaterOwner.IAuth.controller";

export default class TheaterOwnerAuthRepository implements ITheaterOwnerAuthRepository {
    private theaterOwnerCollection: ITheaterOwnerCollection;
    private otpCollection: IOTPCollection;

    constructor(theaterOwnerCollection: ITheaterOwnerCollection, otpCollection: IOTPCollection) {
        this.theaterOwnerCollection = theaterOwnerCollection;
        this.otpCollection = otpCollection;
    }

    async getDataByEmail(email: string): Promise<ITheaterOwnerDocument | null | never> {
        try {
            const theaterOwnerData: ITheaterOwnerDocument | null = await this.theaterOwnerCollection.findOne({ email });
            return theaterOwnerData;
        } catch (err: any) {
            throw err;
        }
    }

    async getDataByPhoneNumber(phoneNumber: string): Promise<ITheaterOwnerDocument | null | never> {
        try {
            const theaterOwnerData: ITheaterOwnerDocument | null = await this.theaterOwnerCollection.findOne({phoneNumber});
            return theaterOwnerData;
        } catch (err: any) {
            throw err;
        }
    }

    async createTheaterOwner(theaterOwnerData: ITheaterOwnerRegisterCredentials): Promise<void | never> {
        try {
            const newTheaterOwner: ITheaterOwnerDocument = new this.theaterOwnerCollection({
                name: theaterOwnerData.name,
                email: theaterOwnerData.email,
                phoneNumber: theaterOwnerData.phoneNumber,
                password: theaterOwnerData.password,
                idProof: theaterOwnerData.IDProof,
                idProofImage: theaterOwnerData.IDProofImage
            });

            await newTheaterOwner.save();
        } catch (err: any) {
            throw err;
        }
    }

    async createOTP(email: string, otp: string): Promise<void | never> {
        try {
            await this.deleteOTPByEmail(email); // delete previous otp if exisits

            const newOTP: IOTPDocument = new this.otpCollection({
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
            return await this.otpCollection.findOne({email, expiresAt: {$gte: new Date()}}).sort({expiresAt: -1});
        } catch (err: any) {
            throw err;
        }
    }

    async makeTheaterOwnerVerified(email: string): Promise<ITheaterOwnerDocument | null | never> {
        try {
            return await this.theaterOwnerCollection.findOneAndUpdate({ email }, { $set: { OTPVerificationStatus: true } }, { new: true });    
        } catch (err: any) {
            throw err;
        }
    }

    private async deleteOTPByEmail(email: string): Promise<void | never> {
        try {
            await this.otpCollection.deleteMany({email});
        } catch (err: any) {
            throw err;
        }
    }
}