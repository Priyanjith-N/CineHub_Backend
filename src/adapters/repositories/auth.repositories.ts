import { IOTPCollection, IOTPDocument } from "../../interface/collections/IOTP.collections";
import { IUserDocument, IUsersCollection } from "../../interface/collections/IUsers.collections";
import { IRegisterCredentials } from "../../interface/controllers/IAuth.controller";
import IAuthRepository from "../../interface/repositories/IAuth.repositories";

export default class AuthRepository implements IAuthRepository {
    private userCollection: IUsersCollection;
    private otpCollection: IOTPCollection;
    constructor(userCollection: IUsersCollection, otpCollection: IOTPCollection) {
        this.userCollection = userCollection;
        this.otpCollection = otpCollection;
    }

    async getDataByEmail(email: string): Promise<IUserDocument | null> {
        try {
            const userData: IUserDocument | null = await this.userCollection.findOne({email});
            return userData;
        } catch (err: any) {
            throw err;
        }
    }

    async getDataByPhoneNumber(phoneNumber: string): Promise<IUserDocument | null> {
        try {
            const userData: IUserDocument | null = await this.userCollection.findOne({phoneNumber});
            return userData;
        } catch (err: any) {
            throw err;
        }
    }

    async createUser(newUserData: IRegisterCredentials): Promise<void> {
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

    async createOTP(email: string, otp: string): Promise<void> {
        try {
            const newOTP: IOTPDocument = new this.otpCollection({
                email: email,
                otp: otp,
                expiresAt: new Date(Date.now() + 90000)
            });

            await newOTP.save();
        } catch (err: any) {
            throw err;
        }
    }

    async getOTPByEmail(email: string | undefined): Promise<IOTPDocument | null> {
        try {
            return await this.otpCollection.findOne({email, expiresAt: {$gte: new Date()}}).sort({expiresAt: -1});
        } catch (err: any) {
            throw err;
        }
    }

    async makeUserVerified(email: string): Promise<void> {
        try {
            await this.deleteOTPByEmail(email);
            await this.userCollection.updateOne({email}, {$set: {OTPVerification: true}});
        } catch (err: any) {
            throw err;
        }
    }

    private async deleteOTPByEmail(email: string): Promise<void> {
        try {
            await this.otpCollection.deleteMany({email});
        } catch (err: any) {
            throw err;
        }
    }
}