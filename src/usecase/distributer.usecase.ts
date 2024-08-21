// interfaces
import { isObjectIdOrHexString } from "mongoose";
import IMovie from "../entity/movie.entity";
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import IDistributerRepository from "../interface/repositories/distributer.repository";
import IDistributerUseCase from "../interface/usecase/distributer.usecase.interface";
import IMovieRequest, { IMovieRequestDetailsForDistributer } from "../entity/movieRequest.entity";
import IEmailService from "../interface/utils/IEmailService";
import { IDistributer, IDistributerList } from "../entity/distributer.entity";

export default class DistributerUseCase implements IDistributerUseCase {
    private distributerRepository: IDistributerRepository;
    private emailService: IEmailService;

    constructor(distributerRepository: IDistributerRepository, emailService: IEmailService) {
        this.distributerRepository = distributerRepository;
        this.emailService = emailService;
    }

    async getAllAvailableMovies(): Promise<IMovie[] | never> {
        try {
            return await this.distributerRepository.getAllAvailableMovies();
        } catch (err: any) {
            throw err;
        }
    }

    async distributeMovie(distributerId: string | undefined, movieId: string | undefined, releaseDate:  Date | undefined, profitSharingPerTicket: number | undefined): Promise<void | never> {
        try {
            if(!distributerId || !movieId || !isObjectIdOrHexString(movieId) || !releaseDate || !profitSharingPerTicket || profitSharingPerTicket < 0 || profitSharingPerTicket > 95) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const isMovieDistributed: IMovie | null = await this.distributerRepository.isDistributed(movieId);

            if(isMovieDistributed) return;

            await this.distributerRepository.distributeMovie(distributerId, movieId, releaseDate, profitSharingPerTicket);
        } catch (err: any) {
            throw err;
        }
    }

    async getDistributedMovies(distributerId: string | undefined): Promise<IMovie[] | never> {
        try {
            if(!distributerId) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            return await this.distributerRepository.getDistibutedMovies(distributerId);
        } catch (err: any) {
            throw err;
        }
    }

    async editProfitSharingOfDistributedMovie(distributerId: string | undefined, movieId: string | undefined, releaseDate:  Date | undefined, profitSharingPerTicket: number | undefined): Promise<void | never> {
        try {
            if(!distributerId || !movieId || !isObjectIdOrHexString(movieId) || !releaseDate || !profitSharingPerTicket || profitSharingPerTicket < 0 || profitSharingPerTicket > 95) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            await this.distributerRepository.editProfitSharingOfDistributedMovie(distributerId, movieId, releaseDate, profitSharingPerTicket);
        } catch (err: any) {
            throw err;
        }
    }

    async getAllMovieRequests(distributerId: string | undefined): Promise<IMovieRequestDetailsForDistributer[] | never> {
        try {
            if(!distributerId || !isObjectIdOrHexString(distributerId)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            return await this.distributerRepository.getAllMovieRequests(distributerId);
        } catch (err: any) {
            throw err;
        }
    }

    async approveMovieRequest(requestId: string | undefined, theaterOwnerEmail: string | undefined, movieName: string | undefined): Promise<void | never> {
        try {
            if(!requestId || !isObjectIdOrHexString(requestId) || !theaterOwnerEmail || !movieName) throw new RequiredCredentialsNotGiven('Provide all required details.');

            const approvedRequestData: IMovieRequest | null = await this.distributerRepository.approveMovieRequest(requestId);

            
            if(!approvedRequestData) throw new RequiredCredentialsNotGiven('Invalid Request Approval.');
            
            const distributerData: IDistributerList | null = await this.distributerRepository.getDistributerById(approvedRequestData.requestedMovieDistributerId as string);

            if(!distributerData) throw new RequiredCredentialsNotGiven('Invalid Request Approval.');

            await this.distributerRepository.addMovieToCollection(approvedRequestData);

            const to: string = theaterOwnerEmail;
            const subjcet: string = `Movie Request Approval For ${movieName} Movie`;
            const text: string = `Your request for ${movieName} for ${approvedRequestData.profitSharingPerTicket} % of profit sharing per ticket sold has been approved by ${distributerData.name}. Movie is added in your collection. ${movieName} now available in your collection to sechdule the show`;
            await this.emailService.sendEmail(to, subjcet, text);
        } catch (err: any) {
            throw err;
        }
    }

    async rejectMovieRequest(requestId: string | undefined, theaterOwnerEmail: string | undefined, movieName: string | undefined, reason: string | undefined): Promise<void | never> {
        try {
            if(!requestId || !isObjectIdOrHexString(requestId) || !theaterOwnerEmail || !movieName || !reason) throw new RequiredCredentialsNotGiven('Provide all required details.');

            await this.distributerRepository.rejectMovieRequest(requestId);

            const to: string = theaterOwnerEmail;
            const subjcet: string = `Movie Request Rejected For ${movieName} Movie`;
            const text: string = reason;

            await this.emailService.sendEmail(to, subjcet, text);
        } catch (err: any) {
            throw err;
        }
    }
}