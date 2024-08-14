// collections
import Admins from "../../frameworks/models/admin.model";

// interfaces
import IAdminAuthRepository from "../../interface/repositories/admin.IAuth.repository";
import IAdmin from "../../entity/admin.entity";

export default class AdminAuthRepository implements IAdminAuthRepository {

    async getDataByEmail(email: string): Promise<IAdmin | null | never> {
        try {
            const adminData: IAdmin | null = await Admins.findOne({email});
            return adminData;
        } catch (err: any) {
            throw err;
        }
    }
}