// interfaces
import { isObjectIdOrHexString } from "mongoose";
import { IDistributerList } from "../entity/distributer.entity";
import ITheaterOwnerRepository from "../interface/repositories/theaterOwnerRepository.interface";
import ITheaterOwnerUseCase, { IScreenData } from "../interface/usecase/theaterOwner.usecase";

// error
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import IMovie from "../entity/movie.entity";
import { IAddScreenCredentials, IAddTheaterCredentials, IGetMovieListOfDistributerData } from "../interface/controllers/theaterOwner.controller";
import ICloudinaryService from "../interface/utils/ICloudinaryService";
import ITheater, { ITheaterOwnerDashboardData } from "../entity/theater.entity";
import AuthenticationError from "../errors/authentication.error";
import { StatusCodes } from "../enums/statusCode.enum";
import IScreen, { ISeatCategory, ISeatCategoryPattern, ISeatLayout } from "../entity/screen.entity";
import IImage, { ILocation } from "../interface/common/IImage.interface";
import IMovieRequest, { IMovieRequestCredentials, IMovieRequestDetails, IMovieReRequestCredentials } from "../entity/movieRequest.entity";
import ITheaterOwnerMovieCollection, { ITheaterOwnerMovieDetails } from "../entity/theaterOwnerMovieCollection.entity";
import IMovieSchedule, { IMovieScheduleWithDetails, IScheduleCredentials, IScheduleSeatLayout } from "../entity/movieSchedule.entity";

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

    async addTheater(theaterOwnerId: string | undefined, name: string | undefined, images: string[] | undefined, licence: string | undefined, location: ILocation | undefined): Promise<void | never> {
        try {
            if(!theaterOwnerId || !name || !images || !licence || !images.length || !location || !location.lng || !location.lat) {
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
                licence,
                location
            }

            theaterCredentials.licence = await this.cloudinaryService.uploadImage(theaterCredentials.licence as string);

            for(let i = 0; i<theaterCredentials.images.length;i++) {
                const imgObj: IImage = await this.cloudinaryService.uploadImage(theaterCredentials.images[i] as string);
                theaterCredentials.images[i] = imgObj;
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

    async getTheater(theaterId: string): Promise<ITheater | never> {
        try {
            const data: ITheater | null = await this.theaterOwnerRepository.getTheaterById(theaterId);

            if(!data) throw new RequiredCredentialsNotGiven('Provide all required details.');

            return data;
        } catch (err: any) {
            throw err;
        }
    }

    async requestMovie(data: IMovieRequestCredentials): Promise<void | never> {
        try {
            if(!data.profitSharingPerTicket || !data.timePeriod || !data.requestedMovieDistributerId || !isObjectIdOrHexString(data.requestedMovieDistributerId) || !data.requestedMovieId || !isObjectIdOrHexString(data.requestedMovieId) || !data.theaterOwnerId || !isObjectIdOrHexString(data.theaterOwnerId)) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            const isAlreadyRequested: IMovieRequest | null = await this.theaterOwnerRepository.isAlreadyRequested(data.requestedMovieId, data.theaterOwnerId);

            const isMovieExistInCollection: ITheaterOwnerMovieCollection | null = await this.theaterOwnerRepository.isAlreadyInCollection(data.requestedMovieId, data.theaterOwnerId);

            if(isAlreadyRequested) {
                throw new AuthenticationError({message: `Already requested for this movie.`, statusCode: StatusCodes.BadRequest,   errorField: 'AlreadyRequested'});
            }else if(isMovieExistInCollection) {
                throw new AuthenticationError({message: `Already exist movie in collection.`, statusCode: StatusCodes.BadRequest,   errorField: 'AlreadyExists'});
            }

            await this.theaterOwnerRepository.saveRequest(data);
        } catch (err: any) {
            throw err;
        }
    }

    async reRequestMovie(data: IMovieReRequestCredentials, movieRequestId: string | undefined): Promise<void | never> {
        try {
            if(!data.profitSharingPerTicket || !data.timePeriod || !movieRequestId || !isObjectIdOrHexString(movieRequestId)) {
                throw new RequiredCredentialsNotGiven('Provide all required details.');
            }

            await this.theaterOwnerRepository.reRequestUpdate(data, movieRequestId);
        } catch (err: any) {
            throw err;
        }
    }

    async getAllMovieRequests(theaterOwnerId: string | undefined): Promise<IMovieRequestDetails[] | never> {
        try {
            if(!theaterOwnerId || !isObjectIdOrHexString(theaterOwnerId)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            return await this.theaterOwnerRepository.getAllRequests(theaterOwnerId);
        } catch (err: any) {
            throw err;
        }
    }

    async getAllMoviesFromOwnerCollection(theaterOwnerId: string | undefined): Promise<ITheaterOwnerMovieDetails[] | never> {
        try {
            if(!theaterOwnerId || !isObjectIdOrHexString(theaterOwnerId)) throw new RequiredCredentialsNotGiven('Provide all required details.');
            
            return await this.theaterOwnerRepository.getAllOwnedMoviesFromCollection(theaterOwnerId);
        } catch (err: any) {
            throw err;
        }
    }

    async addMovieSchedule(data: IScheduleCredentials): Promise<void | never> {
        try {
            if(!data || !data.date || !data.screenId || !isObjectIdOrHexString(data.screenId) || !data.movieId || !isObjectIdOrHexString(data.movieId) || !data.startTime || !data.endTime) throw new RequiredCredentialsNotGiven('Provide all required details.');
            
            const screenData: IScreen | null = await this.theaterOwnerRepository.getScreenById(data.screenId);

            if(!screenData) throw new RequiredCredentialsNotGiven('Provide all required details.');

            const seatLayout: (IScheduleSeatLayout | null)[][] = [];

            for(let i = 0; i < screenData.seatLayout.length; i++) {
                const row: (ISeatLayout | null)[] = screenData.seatLayout[i];

                seatLayout.push([]); // inserted new row

                for(let j = 0; j < row.length; j++) {
                    const seat: ISeatLayout | null = row[j];

                    if(!seat){
                        seatLayout[i].push(null);
                        continue;
                    }

                    const newSeat: IScheduleSeatLayout = {
                        name: seat.name,
                        category: seat.category,
                        price: seat.price,
                        isBooked: false,
                        bookedUserId: null
                    }

                    seatLayout[i].push(newSeat);
                }
            }

            await this.theaterOwnerRepository.addMovieSchedule(data, seatLayout, screenData.capacity);
        } catch (err: any) {
            throw err;
        }
    }

    async getShecdulesBasedOnDate(screenId: string | undefined, date: string | undefined): Promise<IMovieSchedule[] | never> {
        try {
            if(!screenId || !isObjectIdOrHexString(screenId) || !date) throw new RequiredCredentialsNotGiven('Provide all required details.');

            return await this.theaterOwnerRepository.getAllSchedulesBasedOnDates(screenId, new Date(date));
        } catch (err: any) {
            throw err;
        }
    }

    async getAllMovieSchedule(screenId: string | undefined, theaterId: string | undefined): Promise<IMovieScheduleWithDetails[] | never> {
        try {
            if(!screenId || !isObjectIdOrHexString(screenId) || !theaterId || !isObjectIdOrHexString(theaterId)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            return await this.theaterOwnerRepository.getAllMovieSchedule(screenId, theaterId);
        } catch (err: any) {
            throw err;
        }
    }

    async getDashboardData(theaterOwnerId: string | undefined): Promise<ITheaterOwnerDashboardData | never> {
        try {
            if(!theaterOwnerId || !isObjectIdOrHexString(theaterOwnerId)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            const totalActiveMovieCount: number = await this.theaterOwnerRepository.getTotalActiveMovieCount(theaterOwnerId);
            const totalOverallBooking: number = await this.theaterOwnerRepository.getTotalOverallBooking(theaterOwnerId);
            const totalPendingRequest: number = await this.theaterOwnerRepository.getTotalPendingRequest(theaterOwnerId);

            const data: ITheaterOwnerDashboardData = {
                totalActiveMovieCount,
                totalOverallBooking,
                totalPendingRequest
            }

            return data;
        } catch (err: any) {
            throw err;
        }
    }
}