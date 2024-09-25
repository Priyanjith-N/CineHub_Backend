// interfaces
import { ObjectId } from "mongoose";
import { IDistributerList } from "../../entity/distributer.entity";
import IScreen, { ISeatCategory, ISeatLayout } from "../../entity/screen.entity";
import ITheater, { ITheaterOwnerDashboardData } from "../../entity/theater.entity";
import { IAddScreenCredentials, IGetMovieListOfDistributerData } from "../controllers/theaterOwner.controller";
import { IMovieRequestCredentials, IMovieRequestDetails, IMovieReRequestCredentials } from "../../entity/movieRequest.entity";
import { ILocation } from "../common/IImage.interface";
import { ITheaterOwnerMovieDetails } from "../../entity/theaterOwnerMovieCollection.entity";
import IMovieSchedule, { IMovieScheduleWithDetails, IScheduleCredentials } from "../../entity/movieSchedule.entity";

export default interface ITheaterOwnerUseCase {
    getDistributerList(): Promise<IDistributerList[] | never>;
    getMovieListOfDistributer(distributerId: string | undefined): Promise<IGetMovieListOfDistributerData | never>;
    addTheater(theaterOwnerId: string | undefined, name: string | undefined, images: string[] | undefined, licence: string | undefined, location: ILocation | undefined): Promise<void | never>;
    getAllTheaters(theaterOwnerId: string): Promise<ITheater[] | never>;
    addScreen(data: IAddScreenCredentials, theaterId: string | undefined): Promise<void>;
    getAllScreens(theaterId: string | undefined): Promise<IScreen[] | never>;
    getTheater(theaterId: string): Promise<ITheater | never>;
    requestMovie(data: IMovieRequestCredentials): Promise<void | never>;
    reRequestMovie(data: IMovieReRequestCredentials, movieRequestId: string | undefined): Promise<void | never>;
    getAllMovieRequests(theaterOwnerId: string | undefined): Promise<IMovieRequestDetails[] | never>;
    getAllMoviesFromOwnerCollection(theaterOwnerId: string | undefined): Promise<ITheaterOwnerMovieDetails[] | never>;
    addMovieSchedule(data: IScheduleCredentials): Promise<void | never>;
    getShecdulesBasedOnDate(screenId: string | undefined, date: string | undefined): Promise<IMovieSchedule[] | never>;
    getAllMovieSchedule(screenId: string | undefined, theaterId: string | undefined): Promise<IMovieScheduleWithDetails[] | never>;
    getDashboardData(theaterOwnerId: string | undefined): Promise<ITheaterOwnerDashboardData | never>;
}

export interface IScreenData {
    name: string;
    capacity: number;
    seatCategory: ISeatCategory[];
    seatLayout: (ISeatLayout | null)[][];
    theaterId: string | ObjectId;
}