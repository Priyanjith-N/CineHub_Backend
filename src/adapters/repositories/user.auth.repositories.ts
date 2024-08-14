// collections
import Users from "../../frameworks/models/user.model";

// interfaces
import IUserAuthRepository from "../../interface/repositories/user.IAuth.repositories";
import { IUserRegisterCredentials } from "../../interface/controllers/user.IAuth.controller";
import { IUserDocument } from "../../interface/collections/IUsers.collections";
import IUser from "../../entity/user.entity";

export default class UserAuthRepository implements IUserAuthRepository {

    async getDataByEmail(email: string): Promise<IUser | null | never> {
        try {
            const userData: IUser | null = await Users.findOne({email});
            return userData;
        } catch (err: any) {
            throw err;
        }
    }

    async getDataByPhoneNumber(phoneNumber: string): Promise<IUser | null | never> {
        try {
            const userData: IUser | null = await Users.findOne({phoneNumber});
            return userData;
        } catch (err: any) {
            throw err;
        }
    }

    async createUser(newUserData: IUserRegisterCredentials): Promise<void | never> {
        try {
            const newUser: IUserDocument = new Users({
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
            await Users.updateOne({email}, {$set: {OTPVerification: true}});
        } catch (err: any) {
            throw err;
        }
    }
}