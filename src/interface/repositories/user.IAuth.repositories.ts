import { IOTPDocument } from "../collections/IOTP.collections";
import { IUserDocument } from "../collections/IUsers.collections";
import { IUserRegisterCredentials } from "../controllers/user.IAuth.controller";

export default interface IUserAuthRepository {
    getDataByEmail(email: string): Promise<IUserDocument | null | never>;
    getDataByPhoneNumber(phoneNumber: string): Promise<IUserDocument | null | never>;
    createUser(newUserData: IUserRegisterCredentials): Promise<void | never>;
    createOTP(email: string, otp: string): Promise<void | never>;
    getOTPByEmail(email: string | undefined): Promise<IOTPDocument | null | never>;
    makeUserVerified(email: string): Promise<void | never>;
}