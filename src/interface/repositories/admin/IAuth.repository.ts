import { IAdminDocument } from "../../collections/IAdmin.collections";

export default interface IAuthRepository {
    getDataByEmail(email: string): Promise<IAdminDocument | null | never>;
}