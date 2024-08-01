// interfaces
import { IOTPDocument } from "../collections/IOTP.collections";
import { ITheaterOwnerDocument } from "../collections/ITheaterOwner.collection";
import { ITheaterOwnerRegisterCredentials } from "../controllers/theaterOwner.IAuth.controller";

export default interface ITheaterOwnerAuthRepository {
    getDataByEmail(email: string): Promise<ITheaterOwnerDocument | null | never>;
    getDataByPhoneNumber(phoneNumber: string): Promise<ITheaterOwnerDocument | null | never>;
    createTheaterOwner(theaterOwnerData: ITheaterOwnerRegisterCredentials): Promise<void | never>;
    makeTheaterOwnerVerified(email: string): Promise<void | never>;
}