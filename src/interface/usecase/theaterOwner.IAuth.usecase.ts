// interfaces
import { ITheaterOwnerRegisterCredentials } from "../controllers/theaterOwner.IAuth.controller";
import { IAuthTokens } from "../utils/IJWTService";

export default interface ITheaterOwnerAuthUseCase {
    googleLoginUser(idToken: string | undefined): Promise<IAuthTokens | never>;
    authenticateUser(email: string | undefined, password: string | undefined): Promise<IAuthTokens | never>;
    register(registerData: ITheaterOwnerRegisterCredentials): Promise<void | never>;
    OTPVerification(email: string | undefined, otp: string | undefined): Promise<void | never>;
    OTPResend(email: string | undefined): Promise<void | never>;
    verifyToken(authorizationHeader: string | undefined): Promise<void | never>;
}