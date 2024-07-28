// interfaces
import { IDistributerCollection, IDistributerDocument } from "../../interface/collections/IDistributer.collection";
import { ITheaterOwnerCollection, ITheaterOwnerDocument } from "../../interface/collections/ITheaterOwner.collection";
import { IUserDocument, IUsersCollection } from "../../interface/collections/IUsers.collections";
import { IAdminRepository, INotVerifiedDistributers, INotVerifiedTheaterOwners } from "../../interface/repositories/admin.repository.interface";

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

    async getAllDocumentVerificationPendingData(): Promise<(INotVerifiedDistributers | INotVerifiedTheaterOwners)[]> {
        try {
            const theaterOwners: INotVerifiedTheaterOwners[] = await this.theaterOwnerCollection.aggregate(
                [
                    {
                        $match: {
                          'OTPVerificationStatus': true
                        }
                    },
                    {
                        $addFields: {
                          role: 'Theater Owner'
                        }
                    },
                    {
                        $project: {
                            pasword: 0
                        }
                    }
                ]
            );

            const distributer: INotVerifiedDistributers[] = await this.distributerCollection.aggregate(
                [
                    {
                        $match: {
                          'OTPVerificationStatus': true
                        }
                    },
                    {
                        $addFields: {
                          role: 'Distributer'
                        }
                    },
                    {
                        $project: {
                            pasword: 0
                        }
                    }
                ]
            );

            return [...theaterOwners, ...distributer];
        } catch (err: any) {
            throw err;
        }
    }

    async changeDocumentVerificationStatusTheaterOwner(id: string, status: string): Promise<string | undefined | never> {
        try {
            const updatedData: ITheaterOwnerDocument | null = await this.theaterOwnerCollection.findOneAndUpdate({ _id: id }, { $set: { documentVerificationStatus: status } }, { new: true });

            return updatedData?.email;
        } catch (err: any) {
            throw err;
        }
    }

    async changeDocumentVerificationStatusDistributer(id: string, status: string): Promise<string | undefined | never> {
        try {
            const updatedData: IDistributerDocument | null = await this.distributerCollection.findOneAndUpdate({ _id: id }, { $set: { documentVerificationStatus: status } }, { new: true });

            return updatedData?.email;
        } catch (err: any) {
            throw err;
        }
    }

    async getTheaterOwner(id: string): Promise<Omit<ITheaterOwnerDocument, 'password'> | null> {
        try {
            const data: Omit<ITheaterOwnerDocument, 'password'> | null = await this.theaterOwnerCollection.findOne({ _id: id }, { password: 0 });

            return data;
        } catch (err: any) {
            throw err;
        }
    }

    async getDistributer(id: string): Promise<Omit<IDistributerDocument, 'password'> | null> {
        try {
            const data: Omit<IDistributerDocument, 'password'> | null = await this.distributerCollection.findOne({ _id: id }, { password: 0 });

            return data;
        } catch (err: any) {
            throw err;
        }
    }
}