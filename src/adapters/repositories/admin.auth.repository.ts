// collections
import Admins from "../../frameworks/models/admin.model";

// interfaces
import IAdminAuthRepository from "../../interface/repositories/admin.IAuth.repository";
import { IAdminDocument } from "../../interface/collections/IAdmin.collections";

export default class AdminAuthRepository implements IAdminAuthRepository {

    async getDataByEmail(email: string): Promise<IAdminDocument | null | never> {
        try {
            const adminData: IAdminDocument | null = await Admins.findOne({email});
            return adminData;
        } catch (err: any) {
            throw err;
        }
    }
}