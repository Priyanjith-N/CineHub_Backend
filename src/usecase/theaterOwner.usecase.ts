// interfaces
import { isObjectIdOrHexString } from "mongoose";
import { IDistributerList } from "../entity/distributer.entity";
import ITheaterOwnerRepository from "../interface/repositories/theaterOwnerRepository";
import ITheaterOwnerUseCase from "../interface/usecase/theaterOwner.usecase";

// error
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import IMovie from "../entity/movie.entity";
import { IGetMovieListOfDistributerData } from "../interface/controllers/theaterOwner.controller";

export default class TheaterOwnerUseCase implements ITheaterOwnerUseCase {
    private theaterOwnerRepository: ITheaterOwnerRepository;

    constructor(theaterOwnerRepository: ITheaterOwnerRepository) {
        this.theaterOwnerRepository = theaterOwnerRepository;
    }

    async getDistributerList(): Promise<IDistributerList[] | never> {
        try {
            return await this.theaterOwnerRepository.getDistributerList();
        } catch (err: any) {
            throw err;
        }
    }

    async getMovieListOfDistributer(distributerId: string | undefined): Promise<IGetMovieListOfDistributerData | never> {
        try {
            if(!distributerId  || !isObjectIdOrHexString(distributerId)) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const distributer: IDistributerList | null = await this.theaterOwnerRepository.getDistributerById(distributerId);
            
            if(!distributer) {
                throw new RequiredCredentialsNotGiven('Distributer NOT FOUND.');
            }

            const movieList: IMovie[] = await this.theaterOwnerRepository.getMovieListOfDistributer(distributerId);

            const data: IGetMovieListOfDistributerData = {
                distributer,
                movieList
            }

            return data;
        } catch (err: any) {
            throw err;
        }
    }
}