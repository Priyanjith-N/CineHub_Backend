import { IUserRegisterCredentials } from "../controllers/user.IAuth.controller";
import { IAuthTokens } from "../utils/IJWTService";

export default interface IUserAuthUseCase {
    googleLoginUser(idToken: string | undefined): Promise<IAuthTokens | never>;
    authenticateUser(email: string, password: string): Promise<IAuthTokens | never>;
    userRegister(registerData: IUserRegisterCredentials): Promise<void | never>;
    OTPVerification(email: string | undefined, otp: string): Promise<IAuthTokens | never>;
    OTPResend(email: string | undefined): Promise<void | never>;
    verifyToken(authorizationHeader: string | undefined): Promise<void | never>;
}

