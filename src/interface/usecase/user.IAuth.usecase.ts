import { IUserRegisterCredentials } from "../controllers/user.IAuth.controller";

export default interface IUserAuthUseCase {
    authenticateUser(email: string, password: string): Promise<string | never>;
    userRegister(registerData: IUserRegisterCredentials): Promise<void | never>;
    OTPVerification(email: string | undefined, otp: string): Promise<string | never>;
    OTPResend(email: string | undefined): Promise<void | never>;
    verifyToken(token: string | undefined): Promise<void | never>;
}

