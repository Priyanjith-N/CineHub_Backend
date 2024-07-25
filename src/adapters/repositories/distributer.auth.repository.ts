// interfaces
import { IDistributerCollection, IDistributerDocument } from "../../interface/collections/IDistributer.collection";
import { IOTPCollection, IOTPDocument } from "../../interface/collections/IOTP.collections";
import { IDistributerRegisterCredentials } from "../../interface/controllers/distributer.IAuth.controller";
import IDistributerAuthRepository from "../../interface/repositories/distributer.IAuth.repository";

export default class DistributerAuthRepository implements IDistributerAuthRepository {
    private distributerCollection: IDistributerCollection;
    private otpCollection: IOTPCollection;

    constructor(distributerCollection: IDistributerCollection, otpCollection: IOTPCollection) {
        this.distributerCollection = distributerCollection;
        this.otpCollection = otpCollection;
    }

    async getDataByEmail(email: string): Promise<IDistributerDocument | null | never> {
        try {
            const distributerData: IDistributerDocument | null = await this.distributerCollection.findOne({ email });
            return distributerData;
        } catch (err: any) {
            throw err;
        }
    }

    async getDataByPhoneNumber(phoneNumber: string): Promise<IDistributerDocument | null | never> {
        try {
            const distributerData: IDistributerDocument | null = await this.distributerCollection.findOne({phoneNumber});
            return distributerData;
        } catch (err: any) {
            throw err;
        }
    }

    async createDistributer(distributerData: IDistributerRegisterCredentials): Promise<void | never> {
        try {
            const newDistributer: IDistributerDocument = new this.distributerCollection({
                name: distributerData.name,
                email: distributerData.email,
                phoneNumber: distributerData.phoneNumber,
                password: distributerData.password,
                idProof: distributerData.IDProof,
                idProofImage: distributerData.IDProofImage,
                licence: distributerData.licence
            });

            await newDistributer.save();
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