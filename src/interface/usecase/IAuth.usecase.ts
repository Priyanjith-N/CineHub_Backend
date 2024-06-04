import { IRegisterCredentials } from "../controllers/IAuth.controller";

export default interface IAuthUseCase {
    authenticateUser(email: string, password: string): Promise<string>;
    userRegister(registerData: IRegisterCredentials): Promise<void>;
}

