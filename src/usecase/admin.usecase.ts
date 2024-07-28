// interfaces
import { IDistributerDocument } from "../interface/collections/IDistributer.collection";
import { ITheaterOwnerDocument } from "../interface/collections/ITheaterOwner.collection";
import { IUserDocument } from "../interface/collections/IUsers.collections";
import { IAdminRepository } from "../interface/repositories/admin.repository.interface";
import { IAdminUseCase } from "../interface/usecase/admin.usecase.interface";

// errors
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";

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

    async blockOrUnblockUser(id: string | undefined, isBlocked: boolean | undefined): Promise<void | never> {
        try {
            if(!id || (isBlocked === undefined)) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            await this.adminRepository.updateUserIsBlockedStatus(id, isBlocked);
        } catch (err: any) {
            throw err;
        }
    }

    async blockOrUnblockTheaterOwner(id: string | undefined, isBlocked: boolean | undefined): Promise<void | never> {
        try {
            if(!id || (isBlocked === undefined)) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            await this.adminRepository.updateTheaterOwnerIsBlockedStatus(id, isBlocked);
        } catch (err: any) {
            throw err;
        }
    }

    async blockOrUnblockDistributer(id: string | undefined, isBlocked: boolean | undefined): Promise<void | never> {
        try {
            if(!id || (isBlocked === undefined)) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            await this.adminRepository.updateDistributerIsBlockedStatus(id, isBlocked);
        } catch (err: any) {
            throw err;
        }
    }
}