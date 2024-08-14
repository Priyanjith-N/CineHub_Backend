import IAdmin from "../../entity/admin.entity";

export default interface IAdminAuthRepository {
    getDataByEmail(email: string): Promise<IAdmin | null | never>;
}