// interfaces
import IAdminAuthRepository from "../../interface/repositories/admin.IAuth.repository";
import { IAdminCollection, IAdminDocument } from "../../interface/collections/IAdmin.collections";

export default class AdminAuthRepository implements IAdminAuthRepository {
    private adminCollection: IAdminCollection;

    constructor(adminCollection: IAdminCollection){
        this.adminCollection = adminCollection;
    }

    async getDataByEmail(email: string): Promise<IAdminDocument | null | never> {
        try {
            const adminData: IAdminDocument | null = await this.adminCollection.findOne({email});
            return adminData;
        } catch (err: any) {
            throw err;
        }
    }
}