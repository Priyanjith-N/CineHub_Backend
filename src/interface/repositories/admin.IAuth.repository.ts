import { IAdminDocument } from "../collections/IAdmin.collections";

export default interface IAdminAuthRepository {
    getDataByEmail(email: string): Promise<IAdminDocument | null | never>;
}