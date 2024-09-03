import IMovie, { INowPlayingMovies } from "../../entity/movie.entity";
import { IMovieSchedulesForBooking, IMovieSchedulesWithTheaterDetails } from "../../entity/movieSchedule.entity";

export default interface IUserUseCase {
    getAllDataForHomePage(): Promise<IHomeMovieData | never>;
    getMovieDetails(movieId: string | undefined): Promise<IMovie | never>;
    getAllShowsForAMovie(movieId: string | undefined): Promise<IMovieSchedulesWithTheaterDetails[] | never>;
    getTheaterScreenLayout(scheduleId: string | undefined): Promise<IMovieSchedulesForBooking | never>;
}

export interface IHomeMovieData {
    nowPlayingMovies: INowPlayingMovies[];
    recommendedMovies: IMovie[];
    upcommingMovies: IMovie[];
}