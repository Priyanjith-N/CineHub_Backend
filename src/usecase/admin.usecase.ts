import { isObjectIdOrHexString } from "mongoose";

// interfaces
import { IDistributerDocument } from "../interface/collections/IDistributer.collection";
import { ITheaterOwnerDocument } from "../interface/collections/ITheaterOwner.collection";
import { IUserDocument } from "../interface/collections/IUsers.collections";
import { IAdminRepository, IDistributerData, INotVerifiedDistributers, INotVerifiedTheaterOwners, ITheaterOwnerData } from "../interface/repositories/admin.repository.interface";
import { IAdminUseCase } from "../interface/usecase/admin.usecase.interface";
import IEmailService from "../interface/utils/IEmailService";

// errors
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";

export default class AdminUseCase implements IAdminUseCase {
    private adminRepository: IAdminRepository;
    private emailService: IEmailService;

    constructor(adminRepository: IAdminRepository, emailService: IEmailService) {
        this.adminRepository = adminRepository;
        this.emailService = emailService;
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

    async getAllDocumentVerificationRequest(): Promise<(INotVerifiedDistributers | INotVerifiedTheaterOwners)[]> {
        try {
            return await this.adminRepository.getAllDocumentVerificationPendingData();
        } catch (err: any) {
            throw err;
        }
    }

    async changeDocumentVerificationStatusTheaterOwner(id: string | undefined, status: string | undefined, message: string | undefined): Promise<void | never> {
        try {
            if(!id || !status || !isObjectIdOrHexString(id) || !["Approved", "Rejected"].includes(status)) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const email: string | undefined = await this.adminRepository.changeDocumentVerificationStatusTheaterOwner(id, status);

            if(!email) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const to: string = email;
            const subject: string = `Document Verification ${status}`;
            const text: string = message || 'All Document Verified Looking forward business with you. You can now login to your account.';
            await this.emailService.sendEmail(to, subject, text);
        } catch (err: any) {
            throw err;
        }
    }

    async changeDocumentVerificationStatusDistributer(id: string | undefined, status: string | undefined,  message: string | undefined): Promise<void | never> {
        try {
            if(!id || !status || !isObjectIdOrHexString(id) || !["Approved", "Rejected"].includes(status)) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const email: string | undefined = await this.adminRepository.changeDocumentVerificationStatusDistributer(id, status);

            if(!email) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const to: string = email;
            const subject: string = `Document Verification ${status}`;
            const text: string = message || 'All Document Verified Looking forward business with you. You can now login to your account.';
            await this.emailService.sendEmail(to, subject, text);
        } catch (err: any) {
            throw err;
        }
    }

    async getTheaterOwner(id: string | undefined): Promise<ITheaterOwnerData | never> {
        try {
            if(!id || !isObjectIdOrHexString(id)) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const data: Omit<ITheaterOwnerDocument, 'password'> | null = await this.adminRepository.getTheaterOwner(id);

            if(!data) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const newData: ITheaterOwnerData = {...data, _id: (data._id as unknown) as string, role: "Theater Owner"}

            return newData;
        } catch (err: any) {
            throw err;
        }
    }

    async getDistributer(id: string | undefined): Promise<IDistributerData | never> {
        try {
            if(!id || !isObjectIdOrHexString(id)) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const data: Omit<IDistributerDocument, 'password'> | null = await this.adminRepository.getDistributer(id);

            if(!data) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const newData: IDistributerData = {...data, _id: (data._id as unknown) as string, role: "Distributer"}

            return newData;
        } catch (err: any) {
            throw err;
        }
    }
}