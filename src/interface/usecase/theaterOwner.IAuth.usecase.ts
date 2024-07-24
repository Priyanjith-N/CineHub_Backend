// interfaces
import { ITheaterOwnerRegisterCredentials } from "../controllers/theaterOwner.IAuth.controller";

export default interface ITheaterOwnerAuthUseCase {
    authenticateUser(email: string | undefined, password: string | undefined): Promise<string | never>;
    register(registerData: ITheaterOwnerRegisterCredentials): Promise<void | never>;
}