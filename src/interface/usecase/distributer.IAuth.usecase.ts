// interfaces
import { IDistributerRegisterCredentials } from "../controllers/distributer.IAuth.controller";
import { IAuthTokens } from "../utils/IJWTService";

export default interface IDistributerAuthUseCase {
    googleLoginDistributer(idToken: string | undefined): Promise<IAuthTokens | never>;
    authenticateDistributer(email: string | undefined, password: string | undefined): Promise<IAuthTokens | never>;
    register(registerData: IDistributerRegisterCredentials): Promise<void | never>;
    OTPVerification(email: string | undefined, otp: string | undefined): Promise<void | never>;
    OTPResend(email: string | undefined): Promise<void | never>;
    verifyToken(authorizationHeader: string | undefined): Promise<void | never>;
}