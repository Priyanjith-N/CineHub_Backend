import { IUsersCollection } from "../../interface/collections/IUsers.collections";
import IAuthRepository from "../../interface/repositories/IAuth.repositories";

export default class AuthRepository implements IAuthRepository {
    private userCollection: IUsersCollection;
    constructor(userCollection: IUsersCollection) {
        this.userCollection = userCollection;
    }
}