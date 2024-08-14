// interfaces
import ITheaterOwner from "../../entity/theaterOwner.entity";
import { ITheaterOwnerRegisterCredentials } from "../controllers/theaterOwner.IAuth.controller";

export default interface ITheaterOwnerAuthRepository {
    getDataByEmail(email: string): Promise<ITheaterOwner | null | never>;
    getDataByPhoneNumber(phoneNumber: string): Promise<ITheaterOwner | null | never>;
    createTheaterOwner(theaterOwnerData: ITheaterOwnerRegisterCredentials): Promise<void | never>;
    makeTheaterOwnerVerified(email: string): Promise<void | never>;
}