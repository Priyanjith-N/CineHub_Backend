import { IOTPDocument } from "../../collections/IOTP.collections";
import { IUserDocument } from "../../collections/IUsers.collections";
import { IRegisterCredentials } from "../../controllers/user/IAuth.controller";

export default interface IAuthRepository {
    getDataByEmail(email: string): Promise<IUserDocument | null>;
    getDataByPhoneNumber(phoneNumber: string): Promise<IUserDocument | null>;
    createUser(newUserData: IRegisterCredentials): Promise<void>;
    createOTP(email: string, otp: string): Promise<void>;
    getOTPByEmail(email: string | undefined): Promise<IOTPDocument | null>;
    makeUserVerified(email: string): Promise<void>;
}