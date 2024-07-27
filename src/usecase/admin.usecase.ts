// interfaces
import { IDistributerDocument } from "../interface/collections/IDistributer.collection";
import { ITheaterOwnerDocument } from "../interface/collections/ITheaterOwner.collection";
import { IUserDocument } from "../interface/collections/IUsers.collections";
import { IAdminRepository } from "../interface/repositories/admin.repository.interface";
import { IAdminUseCase } from "../interface/usecase/admin.usecase.interface";

export default class AdminUseCase implements IAdminUseCase {
    private adminRepository: IAdminRepository;

    constructor(adminRepository: IAdminRepository) {
        this.adminRepository = adminRepository;
    }

    async getAllUsersData(): Promise<IUserDocument[] | never> {
        try {
            const allUserData: IUserDocument[] = await this.adminRepository.allUser();
            return allUserData;
        } catch (err: any) {
            throw err;
        }
    }

    async getAllTheaterOwnersData(): Promise<ITheaterOwnerDocument[] | never> {
        try {
            const allTheaterOwnerData: ITheaterOwnerDocument[] = await this.adminRepository.allTheaterOwners();
            return allTheaterOwnerData;
        } catch (err: any) {
            throw err;
        }
    }

    async getAllDistributersData(): Promise<IDistributerDocument[] | never> {
        try {
            const allDistributerData: IDistributerDocument[] = await this.adminRepository.allDistributers();
            return allDistributerData;
        } catch (err: any) {
            throw err;
        }
    }
}