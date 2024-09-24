import { isObjectIdOrHexString, Schema } from "mongoose";

// interfaces
import { IAdminRepository, INotVerifiedDistributers, INotVerifiedTheaterOwners } from "../interface/repositories/admin.repository.interface";
import { IAdminUseCase } from "../interface/usecase/admin.usecase.interface";
import IEmailService from "../interface/utils/IEmailService";

// errors
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import IMovie, { IDataMovies, IMovieData } from "../entity/movie.entity";
import { StatusCodes } from "../enums/statusCode.enum";
import AuthenticationError from "../errors/authentication.error";
import ICloudinaryService from "../interface/utils/ICloudinaryService";
import { IDistributer } from "../entity/distributer.entity";
import ITheaterOwner from "../entity/theaterOwner.entity";
import IUser from "../entity/user.entity";
import IImage from "../interface/common/IImage.interface";
import { IDashboardDatas, ITop10Distributers, ITop10Movies, ITop10Theaters } from "../entity/admin.entity";

export default class AdminUseCase implements IAdminUseCase {
    private adminRepository: IAdminRepository;
    private emailService: IEmailService;
    private cloudinaryService: ICloudinaryService;

    constructor(adminRepository: IAdminRepository, emailService: IEmailService, cloudinaryService: ICloudinaryService) {
        this.adminRepository = adminRepository;
        this.emailService = emailService;
        this.cloudinaryService = cloudinaryService;
    }

    async getAllUsersData(): Promise<IUser[] | never> {
        try {
            const allUserData: IUser[] = await this.adminRepository.allUser();
            return allUserData;
        } catch (err: any) {
            throw err;
        }
    }

    async getAllTheaterOwnersData(): Promise<ITheaterOwner[] | never> {
        try {
            const allTheaterOwnerData: ITheaterOwner[] = await this.adminRepository.allTheaterOwners();
            return allTheaterOwnerData;
        } catch (err: any) {
            throw err;
        }
    }

    async getAllDistributersData(): Promise<IDistributer[] | never> {
        try {
            const allDistributerData: IDistributer[] = await this.adminRepository.allDistributers();
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

            movieData.bannerPhoto = await this.cloudinaryService.uploadImage(movieData.bannerPhoto as string);

            movieData.coverPhoto = await this.cloudinaryService.uploadImage(movieData.coverPhoto as string);

            for(let i = 0; i < movieData.cast.length; i++) {
                const each = movieData.cast[i];

                each.image = await this.cloudinaryService.uploadImage(each.image as string);

                movieData.cast[i] = each;
            }

            for(let i = 0; i < movieData.crew.length; i++) {
                const each = movieData.crew[i];

                each.image = await this.cloudinaryService.uploadImage(each.image as string);

                movieData.crew[i] = each;
            }

            await this.adminRepository.saveMovie(movieData);
        } catch (err: any) {
            throw err;
        }
    }

    async getMovie(movieId: string | undefined): Promise<IMovie | never> {
        try {
            if(!movieId || !isObjectIdOrHexString(movieId)) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const data: IMovie | null = await this.adminRepository.getMovie(movieId);

            if(!data) throw new RequiredCredentialsNotGiven('Provide all required details.');

            return data;
        } catch (err: any) {
            throw err;
        }
    }

    async getAllMovies(page: number, isListed: boolean, limit: number): Promise<IDataMovies | never> {
        try {
            if(page === 0 || !page || !limit) throw new RequiredCredentialsNotGiven('Provide all required details.');

            const movies: IMovie[] = await this.adminRepository.getAllMovies(page, isListed, limit);
            const totalMovieCount: number = await this.adminRepository.getTotalMovieCount(isListed);

            const data: IDataMovies = {
                movies,
                totalMovieCount
            }

            return data;
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

    async editMovie(movieData: IMovieData, movieId: string | undefined): Promise<void | never> {
        try {
            if(!movieId || !isObjectIdOrHexString(movieId) || !movieData.about || !movieData.bannerPhoto || !movieData.coverPhoto || !movieData.trailer || !movieData.name || !movieData.cast || !movieData.crew || !movieData.duration || !movieData.duration.hours || !movieData.duration.minutes || !movieData.language || !movieData.language.length || !movieData.category || !movieData.category.length || !movieData.type || movieData.duration.hours > 5 || movieData.duration.minutes > 60 || movieData.duration.minutes < 0 || movieData.duration.hours < 0 || !movieData.cast.length || !movieData.crew.length) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const editMovieData: IMovie | null = await this.adminRepository.getMovie(movieId);

            const isMovieExists: IMovie | null = await this.adminRepository.getMovieByName(movieData.name);

            if(!editMovieData || (isMovieExists && String(isMovieExists._id) !== movieId)) {
                throw new AuthenticationError({message: 'This Movie already exist.', statusCode: StatusCodes.BadRequest, errorField: 'name'});
            }

            // delete all existing images
            await this.cloudinaryService.deleteImage(editMovieData.bannerPhoto.publicId);
            await this.cloudinaryService.deleteImage(editMovieData.coverPhoto.publicId);

            for(const cast of editMovieData.cast) {
                const imgObj: IImage = cast.image as IImage;
                await this.cloudinaryService.deleteImage(imgObj.publicId);
            }

            for(const crew of editMovieData.crew) {
                const imgObj: IImage = crew.image as IImage;
                await this.cloudinaryService.deleteImage(imgObj.publicId);
            }

            movieData.bannerPhoto = await this.cloudinaryService.uploadImage(movieData.bannerPhoto as string);

            movieData.coverPhoto = await this.cloudinaryService.uploadImage(movieData.coverPhoto as string);

            for(let i = 0; i < movieData.cast.length; i++) {
                const each = movieData.cast[i];

                each.image = await this.cloudinaryService.uploadImage(each.image as string);

                movieData.cast[i] = each;
            }

            for(let i = 0; i < movieData.crew.length; i++) {
                const each = movieData.crew[i];

                each.image = await this.cloudinaryService.uploadImage(each.image as string);

                movieData.crew[i] = each;
            }

            await this.adminRepository.updateMovie(movieId, movieData);
        } catch (err: any) {
            throw err;
        }
    }

    async getDataForDashBoard(): Promise<IDashboardDatas | never> {
        try {
            const totalTheatersCount: number = await this.adminRepository.getTheaterCount();
            const totalDistributersCount: number = await this.adminRepository.getDistributerCount();
            const totalMoviesCount: number = await this.adminRepository.getMoviesCount();

            const top10Movies: ITop10Movies[] = await this.adminRepository.getTop10Movies();
            const top10Distributers: ITop10Distributers[] = await this.adminRepository.getTop10Distributers();
            const top10Theaters: ITop10Theaters[] = await this.adminRepository.getTop10Theaters();

            const data = {
                totalTheatersCount,
                totalDistributersCount,
                totalMoviesCount,
                top10Movies,
                top10Distributers,
                top10Theaters
            }

            return data;
        } catch (err: any) {
            throw err;
        }
    }
}