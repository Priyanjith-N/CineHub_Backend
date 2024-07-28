// interfaces
import { IDistributerCollection, IDistributerDocument } from "../../interface/collections/IDistributer.collection";
import { ITheaterOwnerCollection, ITheaterOwnerDocument } from "../../interface/collections/ITheaterOwner.collection";
import { IUserDocument, IUsersCollection } from "../../interface/collections/IUsers.collections";
import { IAdminRepository } from "../../interface/repositories/admin.repository.interface";

export default class AdminRepository implements IAdminRepository {
    private userCollection: IUsersCollection;
    private theaterOwnerCollection: ITheaterOwnerCollection;
    private distributerCollection: IDistributerCollection;

    constructor(userCollection: IUsersCollection, theaterOwnerCollection: ITheaterOwnerCollection, distributerCollection: IDistributerCollection) {
        this.userCollection = userCollection;
        this.theaterOwnerCollection = theaterOwnerCollection;
        this.distributerCollection = distributerCollection;
    }

    async allUser(): Promise<IUserDocument[] | never> {
        try {
            return await this.userCollection.find({}, { password: 0 });
        } catch (err: any) {
            throw err;
        }
    }

    async allTheaterOwners(): Promise<ITheaterOwnerDocument[] | never> {
        try {
            return await this.theaterOwnerCollection.find({}, { password: 0 });
        } catch (err: any) {
            throw err;
        }
    }

    async allDistributers(): Promise<IDistributerDocument[] | never> {
        try {
            return await this.distributerCollection.find({}, { password: 0 });
        } catch (err: any) {
            throw err;
        }
    }

    async updateUserIsBlockedStatus(id: string, isBlocked: boolean): Promise<void | null> {
        try {
            await this.userCollection.updateOne({ _id: id }, { $set: { isBlocked } });
        } catch (err: any) {
            throw err;
        }
    }

    async updateTheaterOwnerIsBlockedStatus(id: string, isBlocked: boolean): Promise<void | null> {
        try {
            await this.theaterOwnerCollection.updateOne({ _id: id }, { $set: { isBlocked } });
        } catch (err: any) {
            throw err;
        }
    }

    async updateDistributerIsBlockedStatus(id: string, isBlocked: boolean): Promise<void | null> {
        try {
            await this.distributerCollection.updateOne({ _id: id }, { $set: { isBlocked } });
        } catch (err: any) {
            throw err;
        }
    }
}