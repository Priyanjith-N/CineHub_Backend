import { IRegisterCredentials } from "../../controllers/user/IAuth.controller";

export default interface IAuthUseCase {
    authenticateUser(email: string, password: string): Promise<string | never>;
    userRegister(registerData: IRegisterCredentials): Promise<void | never>;
    OTPVerification(email: string | undefined, otp: string): Promise<string | never>;
    OTPResend(email: string | undefined): Promise<void | never>;
    verifyToken(token: string | undefined): Promise<void | never>;
}

