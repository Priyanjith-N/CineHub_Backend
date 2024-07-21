// interfaces
import { ITheaterOwnerCollection, ITheaterOwnerDocument } from "../../interface/collections/ITheaterOwner.collection";
import { IOTPCollection, IOTPDocument } from "../../interface/collections/IOTP.collections";
import ITheaterOwnerAuthRepository from "../../interface/repositories/theaterOwner.IAuth.repository";

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

    private async deleteOTPByEmail(email: string): Promise<void | never> {
        try {
            await this.otpCollection.deleteMany({email});
        } catch (err: any) {
            throw err;
        }
    }
}