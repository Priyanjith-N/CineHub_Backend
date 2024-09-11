import IUser, { IUserProfile } from "../../entity/user.entity";
import { IUserRegisterCredentials } from "../controllers/user.IAuth.controller";

export default interface IUserAuthRepository {
    getDataByEmail(email: string): Promise<IUser | null | never>;
    getDataByPhoneNumber(phoneNumber: string): Promise<IUser | null | never>;
    createUser(newUserData: IUserRegisterCredentials): Promise<void | never>;
    makeUserVerified(email: string): Promise<void | never>;
    getUserProfileData(userId: string): Promise<IUserProfile | null>;
}