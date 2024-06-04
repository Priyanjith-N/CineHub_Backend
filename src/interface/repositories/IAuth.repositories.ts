import { IUserDocument } from "../collections/IUsers.collections";
import { IRegisterCredentials } from "../controllers/IAuth.controller";

export default interface IAuthRepository {
    getDataByEmail(email: string): Promise<IUserDocument | null>;
    createUser(newUserData: IRegisterCredentials): Promise<void>;
}