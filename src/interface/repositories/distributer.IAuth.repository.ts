import { IDistributerDocument } from "../collections/IDistributer.collection";

export default interface IDistributerAuthRepository {
    getDataByEmail(email: string): Promise<IDistributerDocument | null | never>;
    createOTP(email: string, otp: string): Promise<void | never>;
}