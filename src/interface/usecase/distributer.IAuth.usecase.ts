// interfaces
import { IDistributerRegisterCredentials } from "../controllers/distributer.IAuth.controller";

export default interface IDistributerAuthUseCase {
    authenticateUser(email: string | undefined, password: string | undefined): Promise<string | never>;
    register(registerData: IDistributerRegisterCredentials): Promise<void | never>;
}