// interfaces
import { IDistributerRegisterCredentials } from "../controllers/distributer.IAuth.controller";

export default interface IDistributerAuthUseCase {
    googleLoginDistributer(idToken: string | undefined): Promise<string | never>;
    authenticateDistributer(email: string | undefined, password: string | undefined): Promise<string | never>;
    register(registerData: IDistributerRegisterCredentials): Promise<void | never>;
    OTPVerification(email: string | undefined, otp: string | undefined): Promise<void | never>;
    OTPResend(email: string | undefined): Promise<void | never>;
    verifyToken(token: string | undefined): Promise<void | never>;
}