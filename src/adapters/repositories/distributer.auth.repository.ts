// collections
import { IDistributer } from "../../entity/distributer.entity";
import Distributers from "../../frameworks/models/distributer.model";
import { IDistributerDocument } from "../../interface/collections/IDistributer.collection";

// interfaces
import { IDistributerRegisterCredentials } from "../../interface/controllers/distributer.IAuth.controller";
import IDistributerAuthRepository from "../../interface/repositories/distributer.IAuth.repository";

export default class DistributerAuthRepository implements IDistributerAuthRepository {

    async getDataByEmail(email: string): Promise<IDistributer | null | never> {
        try {
            const distributerData: IDistributer | null = await Distributers.findOne({ email });
            return distributerData;
        } catch (err: any) {
            throw err;
        }
    }

    async getDataByPhoneNumber(phoneNumber: string): Promise<IDistributer | null | never> {
        try {
            const distributerData: IDistributer | null = await Distributers.findOne({phoneNumber});
            return distributerData;
        } catch (err: any) {
            throw err;
        }
    }

    async createDistributer(distributerData: IDistributerRegisterCredentials): Promise<void | never> {
        try {
            const newDistributer: IDistributerDocument = new Distributers({
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

    async makeDistributerVerified(email: string): Promise<void | never> {
        try {
            await Distributers.updateOne({ email }, { $set: { OTPVerificationStatus: true } });
        } catch (err: any) {
            throw err;
        }
    }
}