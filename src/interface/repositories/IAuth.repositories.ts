import { IUserDocument } from "../collections/IUsers.collections";

export default interface IAuthRepository {
    getDataByEmail(email: string): Promise<IUserDocument | null>;
}