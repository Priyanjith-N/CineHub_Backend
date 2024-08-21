import { IUserRegisterCredentials } from "../controllers/user.IAuth.controller";

export default interface IUserAuthUseCase {
    googleLoginUser(idToken: string | undefined): Promise<string | never>;
    authenticateUser(email: string, password: string): Promise<string | never>;
    userRegister(registerData: IUserRegisterCredentials): Promise<void | never>;
    OTPVerification(email: string | undefined, otp: string): Promise<string | never>;
    OTPResend(email: string | undefined): Promise<void | never>;
    verifyToken(authorizationHeader: string | undefined): Promise<void | never>;
}

