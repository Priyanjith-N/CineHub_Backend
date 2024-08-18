// interfaces
import { isObjectIdOrHexString } from "mongoose";
import IMovie from "../entity/movie.entity";
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import IDistributerRepository from "../interface/repositories/distributer.repository";
import IDistributerUseCase from "../interface/usecase/distributer.usecase.interface";
import { IMovieRequestDetailsForDistributer } from "../entity/movieRequest.entity";

export default class DistributerUseCase implements IDistributerUseCase {
    private distributerRepository: IDistributerRepository;

    constructor(distributerRepository: IDistributerRepository) {
        this.distributerRepository = distributerRepository;
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
}