import { ITheaterOwnerDocument } from "../collections/ITheaterOwner.collection";

export default interface ITheaterOwnerAuthRepository {
    getDataByEmail(email: string): Promise<ITheaterOwnerDocument | null | never>;
    createOTP(email: string, otp: string): Promise<void | never>;
}