import { IAdminCollection, IAdminDocument } from "../../../interface/collections/IAdmin.collections";
import IAuthRepository from "../../../interface/repositories/admin/IAuth.repository";

export default class AuthRepository implements IAuthRepository {
    private adminCollection: IAdminCollection;

    constructor(adminCollection: IAdminCollection){
        this.adminCollection = adminCollection;
    }

    async getDataByEmail(email: string): Promise<IAdminDocument | null | never> {
        try {
            const userData: IAdminDocument | null = await this.adminCollection.findOne({email});
            return userData;
        } catch (err: any) {
            throw err;
        }
    }
}