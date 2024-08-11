// interfaces
import { isObjectIdOrHexString } from "mongoose";
import { IDistributerList } from "../entity/distributer.entity";
import ITheaterOwnerRepository from "../interface/repositories/theaterOwnerRepository";
import ITheaterOwnerUseCase from "../interface/usecase/theaterOwner.usecase";

// error
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import IMovie from "../entity/movie.entity";
import { IAddTheaterCredentials, IGetMovieListOfDistributerData } from "../interface/controllers/theaterOwner.controller";
import ICloudinaryService from "../interface/utils/ICloudinaryService";
import ITheater from "../entity/theater.entity";
import AuthenticationError from "../errors/authentication.error";
import { StatusCodes } from "../enums/statusCode.enum";

export default class TheaterOwnerUseCase implements ITheaterOwnerUseCase {
    private theaterOwnerRepository: ITheaterOwnerRepository;
    private cloudinaryService: ICloudinaryService;

    constructor(theaterOwnerRepository: ITheaterOwnerRepository, cloudinaryService: ICloudinaryService) {
        this.theaterOwnerRepository = theaterOwnerRepository;
        this.cloudinaryService = cloudinaryService;
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

    async addTheater(theaterOwnerId: string | undefined, name: string | undefined, images: string[] | undefined, licence: string | undefined): Promise<void | never> {
        try {
            if(!theaterOwnerId || !name || !images || !licence || !images.length) {
                throw new RequiredCredentialsNotGiven('Distributer NOT FOUND.');
            }

            const isTheaterExist: ITheater | null = await this.theaterOwnerRepository.getTheaterByName(name);

            if(isTheaterExist) {
                throw new AuthenticationError({message: 'This name already taken.', statusCode: StatusCodes.BadRequest, errorField: 'name'});
            }

            const theaterCredentials: IAddTheaterCredentials = {
                theaterOwnerId,
                name,
                images,
                licence
            }

            theaterCredentials.licence = await this.cloudinaryService.uploadImage(theaterCredentials.licence);

            for(let i = 0; i<theaterCredentials.images.length;i++) {
                const url: string = await this.cloudinaryService.uploadImage(theaterCredentials.images[i]);
                theaterCredentials.images[i] = url;
            }

            await this.theaterOwnerRepository.saveTheater(theaterCredentials);
        } catch (err: any) {
            throw err;
        }
    }

    async getAllTheaters(theaterOwnerId: string): Promise<ITheater[] | never> {
        try {
            return await this.theaterOwnerRepository.getTheatersByOwnerId(theaterOwnerId);
        } catch (err: any) {
            throw err;
        }
    }
}