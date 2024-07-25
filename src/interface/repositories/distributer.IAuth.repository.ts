// interfaces
import { IDistributerDocument } from "../collections/IDistributer.collection";
import { IOTPDocument } from "../collections/IOTP.collections";
import { IDistributerRegisterCredentials } from "../controllers/distributer.IAuth.controller";

export default interface IDistributerAuthRepository {
    getDataByEmail(email: string): Promise<IDistributerDocument | null | never>;
    getDataByPhoneNumber(phoneNumber: string): Promise<IDistributerDocument | null | never>;
    createDistributer(distributerData: IDistributerRegisterCredentials): Promise<void | never>;
    createOTP(email: string, otp: string): Promise<void | never>;
    getOTPByEmail(email: string): Promise<IOTPDocument | null | never>;
    makeTheaterOwnerVerified(email: string): Promise<IDistributerDocument | null | never>;
}