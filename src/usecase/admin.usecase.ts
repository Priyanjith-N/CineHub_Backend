import { isObjectIdOrHexString } from "mongoose";

// interfaces
import { IDistributerDocument } from "../interface/collections/IDistributer.collection";
import { ITheaterOwnerDocument } from "../interface/collections/ITheaterOwner.collection";
import { IUserDocument } from "../interface/collections/IUsers.collections";
import { IAdminRepository, INotVerifiedDistributers, INotVerifiedTheaterOwners } from "../interface/repositories/admin.repository.interface";
import { IAdminUseCase } from "../interface/usecase/admin.usecase.interface";
import IEmailService from "../interface/utils/IEmailService";

// errors
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import IMovie, { IMovieData } from "../entity/movie.entity";
import { StatusCodes } from "../enums/statusCode.enum";
import AuthenticationError from "../errors/authentication.error";
import ICloudinaryService from "../interface/utils/ICloudinaryService";

export default class AdminUseCase implements IAdminUseCase {
    private adminRepository: IAdminRepository;
    private emailService: IEmailService;
    private cloudinaryService: ICloudinaryService;

    constructor(adminRepository: IAdminRepository, emailService: IEmailService, cloudinaryService: ICloudinaryService) {
        this.adminRepository = adminRepository;
        this.emailService = emailService;
        this.cloudinaryService = cloudinaryService;
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

    async getTheaterOwner(id: string | undefined): Promise<INotVerifiedTheaterOwners | never> {
        try {
            if(!id || !isObjectIdOrHexString(id)) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const data: INotVerifiedTheaterOwners | undefined = await this.adminRepository.getTheaterOwner(id);

            if(!data) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }
            

            return data;
        } catch (err: any) {
            throw err;
        }
    }

    async getDistributer(id: string | undefined): Promise<INotVerifiedDistributers | never> {
        try {
            if(!id || !isObjectIdOrHexString(id)) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const data: INotVerifiedDistributers | undefined = await this.adminRepository.getDistributer(id);

            if(!data) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            return data;
        } catch (err: any) {
            throw err;
        }
    }

    async addMovie(movieData: IMovieData): Promise<void | never> {
        try {
            if(!movieData.about || !movieData.bannerPhoto || !movieData.coverPhoto || !movieData.trailer || !movieData.name || !movieData.cast || !movieData.crew || !movieData.duration || !movieData.duration.hours || !movieData.duration.minutes || !movieData.language || !movieData.language.length || !movieData.category || !movieData.category.length || !movieData.type || movieData.duration.hours > 5 || movieData.duration.minutes > 60 || movieData.duration.minutes < 0 || movieData.duration.hours < 0 || !movieData.cast.length || !movieData.crew.length) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const isMovieExists: IMovie | null = await this.adminRepository.getMovieByName(movieData.name);

            if(isMovieExists) {
                throw new AuthenticationError({message: 'This Movie already exist.', statusCode: StatusCodes.BadRequest, errorField: 'name'});
            }

            movieData.bannerPhoto = await this.cloudinaryService.uploadImage(movieData.bannerPhoto);

            movieData.coverPhoto = await this.cloudinaryService.uploadImage(movieData.coverPhoto);

            for(let i = 0; i < movieData.cast.length; i++) {
                const each = movieData.cast[i];

                each.image = await this.cloudinaryService.uploadImage(each.image);

                movieData.cast[i] = each;
            }

            for(let i = 0; i < movieData.crew.length; i++) {
                const each = movieData.crew[i];

                each.image = await this.cloudinaryService.uploadImage(each.image);

                movieData.crew[i] = each;
            }

            await this.adminRepository.saveMovie(movieData);
        } catch (err: any) {
            throw err;
        }
    }

    async getAllMovies(): Promise<IMovie[] | never> {
        try {
            const movies: IMovie[] = await this.adminRepository.getAllMovies();

            return movies;
        } catch (err: any) {
            throw err;
        }
    }

    async listOrUnlistMovies(id: string | undefined, status: boolean | undefined): Promise<void | never> {
        try {
            if(!id || typeof status !== "boolean" || !isObjectIdOrHexString(id) ){
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            await this.adminRepository.makeMovieAsListedOrUnlisted(id, status);
        } catch (err: any) {
            throw err;
        }
    }
}