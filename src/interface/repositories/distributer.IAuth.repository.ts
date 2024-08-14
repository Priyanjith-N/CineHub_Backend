// interfaces
import { IDistributer } from "../../entity/distributer.entity";
import { IDistributerRegisterCredentials } from "../controllers/distributer.IAuth.controller";

export default interface IDistributerAuthRepository {
    getDataByEmail(email: string): Promise<IDistributer | null | never>;
    getDataByPhoneNumber(phoneNumber: string): Promise<IDistributer | null | never>;
    createDistributer(distributerData: IDistributerRegisterCredentials): Promise<void | never>;
    makeDistributerVerified(email: string): Promise<void | never>;
}