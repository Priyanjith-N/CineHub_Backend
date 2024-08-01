// interfaces
import { ITheaterOwnerCollection, ITheaterOwnerDocument } from "../../interface/collections/ITheaterOwner.collection";
import { IOTPCollection, IOTPDocument } from "../../interface/collections/IOTP.collections";
import ITheaterOwnerAuthRepository from "../../interface/repositories/theaterOwner.IAuth.repository";
import { ITheaterOwnerRegisterCredentials } from "../../interface/controllers/theaterOwner.IAuth.controller";

export default class TheaterOwnerAuthRepository implements ITheaterOwnerAuthRepository {
    private theaterOwnerCollection: ITheaterOwnerCollection;

    constructor(theaterOwnerCollection: ITheaterOwnerCollection) {
        this.theaterOwnerCollection = theaterOwnerCollection;
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

    async makeTheaterOwnerVerified(email: string): Promise<void | never> {
        try {
            await this.theaterOwnerCollection.updateOne({ email }, { $set: { OTPVerificationStatus: true } });    
        } catch (err: any) {
            throw err;
        }
    }
}