// interfaces
import { IDistributerRegisterCredentials } from "../controllers/distributer.IAuth.controller";

export default interface IDistributerAuthUseCase {
    authenticateUser(email: string | undefined, password: string | undefined): Promise<string | never>;
    register(registerData: IDistributerRegisterCredentials): Promise<void | never>;
    OTPVerification(email: string | undefined, otp: string | undefined): Promise<string | never>;
    OTPResend(email: string | undefined): Promise<void | never>;
}