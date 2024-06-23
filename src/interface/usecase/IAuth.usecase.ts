import { IRegisterCredentials } from "../controllers/IAuth.controller";

export default interface IAuthUseCase {
    authenticateUser(email: string, password: string): Promise<string>;
    userRegister(registerData: IRegisterCredentials): Promise<void>;
    OTPVerification(email: string | undefined, otp: string): Promise<string>;
    OTPResend(email: string | undefined): Promise<void>;
    verifyToken(token: string | undefined): Promise<void>;
}

