// interfaces
import { ITheaterOwnerRegisterCredentials } from "../controllers/theaterOwner.IAuth.controller";

export default interface ITheaterOwnerAuthUseCase {
    googleLoginUser(idToken: string | undefined): Promise<string | never>;
    authenticateUser(email: string | undefined, password: string | undefined): Promise<string | never>;
    register(registerData: ITheaterOwnerRegisterCredentials): Promise<void | never>;
    OTPVerification(email: string | undefined, otp: string | undefined): Promise<string | never>;
    OTPResend(email: string | undefined): Promise<void | never>;
    verifyToken(token: string | undefined): Promise<void | never>;
}