// interfaces
import { IDistributerList } from "../../entity/distributer.entity";
import IMovie from "../../entity/movie.entity";
import IMovieRequest, { IMovieRequestCredentials, IMovieRequestDetails, IMovieReRequestCredentials } from "../../entity/movieRequest.entity";
import IMovieSchedule, { IScheduleCredentials, IScheduleSeatLayout } from "../../entity/movieSchedule.entity";
import IScreen from "../../entity/screen.entity";
import ITheater from "../../entity/theater.entity";
import ITheaterOwnerMovieCollection, { ITheaterOwnerMovieDetails } from "../../entity/theaterOwnerMovieCollection.entity";
import { IAddTheaterCredentials } from "../controllers/theaterOwner.controller";
import { IScreenData } from "../usecase/theaterOwner.usecase";

export default interface ITheaterOwnerRepository {
    getDistributerList(): Promise<IDistributerList[] | never>;
    getDistributerById(distributerId: string): Promise<IDistributerList | null | never>;
    getMovieListOfDistributer(distributerId: string): Promise<IMovie[] | never>;
    getTheaterByName(name: string): Promise<ITheater | null | never>;
    saveTheater(data: IAddTheaterCredentials): Promise<void | never>;
    getTheatersByOwnerId(theaterOwnerId: string): Promise<ITheater[] | never>;
    getTheaterById(_id: string): Promise<ITheater | null | never>;
    getScreenByName(name: string, theaterId: string): Promise<IScreen | null | never>;
    saveScreen(data: IScreenData): Promise<void | never>;
    getAllScreens(theaterId: string): Promise<IScreen[] | never>;
    isAlreadyRequested(movieId: string, theaterOwnerId: string): Promise<IMovieRequest | null | never>;
    saveRequest(data: IMovieRequestCredentials): Promise<void | never>;
    reRequestUpdate(data: IMovieReRequestCredentials, movieRequestId: string): Promise<void | never>;
    getAllRequests(theaterOwner: string): Promise<IMovieRequestDetails[] | never>;
    isAlreadyInCollection(movieId: string, theaterOwnerId: string): Promise<ITheaterOwnerMovieCollection | null | never>;
    getAllOwnedMoviesFromCollection(theaterOwnerId: string): Promise<ITheaterOwnerMovieDetails[] | never>;
    getScreenById(screenId: string): Promise<IScreen | null | never>;
    addMovieSchedule(data: IScheduleCredentials, seatLayout: (IScheduleSeatLayout | null)[][], totalCapacity: number): Promise<void | never>;
    getAllSchedulesBasedOnDates(screenId: string, date: Date): Promise<IMovieSchedule[] | never>;
}