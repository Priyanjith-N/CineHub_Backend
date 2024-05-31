import { IUserDocument, IUsersCollection } from "../../interface/collections/IUsers.collections";
import IAuthRepository from "../../interface/repositories/IAuth.repositories";

export default class AuthRepository implements IAuthRepository {
    private userCollection: IUsersCollection;
    constructor(userCollection: IUsersCollection) {
        this.userCollection = userCollection;
    }

    async getDataByEmail(email: string): Promise<IUserDocument | null> {
        try {
            const userData: IUserDocument | null = await this.userCollection.findOne({email});
            return userData;
        } catch (err: any) {
            throw err;
        }
    }
}