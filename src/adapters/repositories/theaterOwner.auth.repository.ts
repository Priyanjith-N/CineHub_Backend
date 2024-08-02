// collections
import TheaterOwners from "../../frameworks/models/theaterOwner.model";

// interfaces
import { ITheaterOwnerDocument } from "../../interface/collections/ITheaterOwner.collection";
import ITheaterOwnerAuthRepository from "../../interface/repositories/theaterOwner.IAuth.repository";
import { ITheaterOwnerRegisterCredentials } from "../../interface/controllers/theaterOwner.IAuth.controller";

export default class TheaterOwnerAuthRepository implements ITheaterOwnerAuthRepository {

    async getDataByEmail(email: string): Promise<ITheaterOwnerDocument | null | never> {
        try {
            const theaterOwnerData: ITheaterOwnerDocument | null = await TheaterOwners.findOne({ email });
            return theaterOwnerData;
        } catch (err: any) {
            throw err;
        }
    }

    async getDataByPhoneNumber(phoneNumber: string): Promise<ITheaterOwnerDocument | null | never> {
        try {
            const theaterOwnerData: ITheaterOwnerDocument | null = await TheaterOwners.findOne({phoneNumber});
            return theaterOwnerData;
        } catch (err: any) {
            throw err;
        }
    }

    async createTheaterOwner(theaterOwnerData: ITheaterOwnerRegisterCredentials): Promise<void | never> {
        try {
            const newTheaterOwner: ITheaterOwnerDocument = new TheaterOwners({
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
            await TheaterOwners.updateOne({ email }, { $set: { OTPVerificationStatus: true } });    
        } catch (err: any) {
            throw err;
        }
    }
}