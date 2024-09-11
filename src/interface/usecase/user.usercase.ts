import IMovie, { INowPlayingMovies } from "../../entity/movie.entity";
import { IMovieSchedulesForBooking, IMovieSchedulesWithTheaterDetails } from "../../entity/movieSchedule.entity";
import { IBookSeatCredentials, ICreateCheckoutSessionCredentials } from "../../entity/user.entity";

export default interface IUserUseCase {
    getAllDataForHomePage(): Promise<IHomeMovieData | never>;
    getMovieDetails(movieId: string | undefined): Promise<IMovie | never>;
    getAllShowsForAMovie(movieId: string | undefined): Promise<IMovieSchedulesWithTheaterDetails[] | never>;
    getTheaterScreenLayout(scheduleId: string | undefined): Promise<IMovieSchedulesForBooking | never>;
    createCheckoutSession(data: ICreateCheckoutSessionCredentials): Promise<string>;
    bookSeat(bookSeatData: IBookSeatCredentials | undefined, userId: string | undefined, checkoutSessionId: string | undefined): Promise<void>;
}

export interface IHomeMovieData {
    nowPlayingMovies: INowPlayingMovies[];
    recommendedMovies: IMovie[];
    upcommingMovies: IMovie[];
}