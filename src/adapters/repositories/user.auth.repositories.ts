// interfaces
import IUserAuthRepository from "../../interface/repositories/user.IAuth.repositories";
import { IUserRegisterCredentials } from "../../interface/controllers/user.IAuth.controller";
import { IUserDocument, IUsersCollection } from "../../interface/collections/IUsers.collections";
import { IOTPCollection, IOTPDocument } from "../../interface/collections/IOTP.collections";

export default class UserAuthRepository implements IUserAuthRepository {
    private userCollection: IUsersCollection;
    
    constructor(userCollection: IUsersCollection) {
        this.userCollection = userCollection;
    }

    async getDataByEmail(email: string): Promise<IUserDocument | null | never> {
        try {
            const userData: IUserDocument | null = await this.userCollection.findOne({email});
            return userData;
        } catch (err: any) {
            throw err;
        }
    }

    async getDataByPhoneNumber(phoneNumber: string): Promise<IUserDocument | null | never> {
        try {
            const userData: IUserDocument | null = await this.userCollection.findOne({phoneNumber});
            return userData;
        } catch (err: any) {
            throw err;
        }
    }

    async createUser(newUserData: IUserRegisterCredentials): Promise<void | never> {
        try {
            const newUser: IUserDocument = new this.userCollection({
                name: newUserData.name,
                email: newUserData.email,
                phoneNumber: newUserData.phoneNumber,
                password: newUserData.password
            });

            await newUser.save();
        } catch (err: any) {
            throw err;
        }
    }

    async makeUserVerified(email: string): Promise<void | never> {
        try {
            await this.userCollection.updateOne({email}, {$set: {OTPVerification: true}});
        } catch (err: any) {
            throw err;
        }
    }
}