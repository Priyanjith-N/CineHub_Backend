// interfaces
import { isObjectIdOrHexString } from "mongoose";
import { IDistributerList } from "../entity/distributer.entity";
import ITheaterOwnerRepository from "../interface/repositories/theaterOwnerRepository";
import ITheaterOwnerUseCase, { IScreenData } from "../interface/usecase/theaterOwner.usecase";

// error
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import IMovie from "../entity/movie.entity";
import { IAddScreenCredentials, IAddTheaterCredentials, IGetMovieListOfDistributerData } from "../interface/controllers/theaterOwner.controller";
import ICloudinaryService from "../interface/utils/ICloudinaryService";
import ITheater from "../entity/theater.entity";
import AuthenticationError from "../errors/authentication.error";
import { StatusCodes } from "../enums/statusCode.enum";
import IScreen, { ISeatCategory, ISeatCategoryPattern, ISeatLayout } from "../entity/screen.entity";

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
                throw new RequiredCredentialsNotGiven('Provide all required details.');
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

    async addScreen(data: IAddScreenCredentials, theaterId: string | undefined): Promise<void> {
        try {
            if(!theaterId || !isObjectIdOrHexString(theaterId) || !data.name || !data.capacity || !data.seatCategory || !data.seatCategory.length || !data.seatCategoryPattern || !data.seatCategoryPattern.length || !data.seatLayout || !data.seatLayout.length || !data.seatNumberPattern || !data.seatNumberPattern.pattern || !data.seatNumberPattern.startFrom) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }
            
            const theaterData: ITheater | null = await this.theaterOwnerRepository.getTheaterById(theaterId);
            
            if(!theaterData) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const isScreenExist: IScreen | null = await this.theaterOwnerRepository.getScreenByName(data.name, theaterId);

            if(isScreenExist) {
                throw new AuthenticationError({message: 'This Screen name already exist.', statusCode: StatusCodes.BadRequest, errorField: 'name'});
            }

            const seatLayout: (ISeatLayout | null)[][] = [];

            let rowNumber = 0;
            const seatCategoryWithRowNumber: Record<string, number[]> = {}
            
            for(let i = 0; i < data.seatLayout.length ; i++) {
                seatLayout.push([]);
                const row: boolean[] = data.seatLayout[i];
                const seatCategory: ISeatCategoryPattern | undefined | null = data.seatCategoryPattern[i];

                if(seatCategory){
                    rowNumber++;
                    if(seatCategoryWithRowNumber[seatCategory.category]) {
                        seatCategoryWithRowNumber[seatCategory.category].push(rowNumber);
                    }else{
                        seatCategoryWithRowNumber[seatCategory.category] = [rowNumber];
                    }
                }

                let colNumber = 1;
                for(const seat of row) {
                    if(seat) {
                        const seatObj: ISeatLayout = {
                            name: `${String.fromCharCode(64 + rowNumber)}${colNumber}`,
                            category: seatCategory!.category,
                            price: seatCategory!.price
                        }

                        seatLayout[i].push(seatObj);
                        colNumber++;
                    }else{
                        seatLayout[i].push(null);
                    }
                }
            }

            const seatCategory: ISeatCategory[] = Object.entries(seatCategoryWithRowNumber).map((val) => {
                return {
                    category: val[0],
                    rowNumbers: val[1]
                }
            })

            const screenData: IScreenData = {
                name: data.name,
                capacity: data.capacity,
                seatCategory,
                seatLayout,
                theaterId
            }

            
            await this.theaterOwnerRepository.saveScreen(screenData);
        } catch (err: any) {
            throw err;
        }
    }

    async getAllScreens(theaterId: string | undefined): Promise<IScreen[] | never> {
        try {
            if(!theaterId || !isObjectIdOrHexString(theaterId)) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const theaterData: ITheater | null = await this.theaterOwnerRepository.getTheaterById(theaterId);
    
            if(!theaterData) throw new RequiredCredentialsNotGiven('Provide all required details.');
            
            return await this.theaterOwnerRepository.getAllScreens(theaterId);
        } catch (err: any) {
            throw err;
        }
    }
}