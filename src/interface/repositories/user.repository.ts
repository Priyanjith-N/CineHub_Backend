import IMovie, { INowPlayingMovies } from "../../entity/movie.entity";
import { IMovieSchedulesForBooking, IMovieSchedulesWithTheaterDetails } from "../../entity/movieSchedule.entity";

export default interface IUserRepository {
    upcommingMovies(): Promise<IMovie[] | never>;
    recommendedMovies(): Promise<IMovie[] | never>;
    nowPlayingMovies(): Promise<INowPlayingMovies[] | never>;
    getMovieDetails(movieId: string): Promise<IMovie | null | never>;
    getAllShowsForAMovie(movieId: string): Promise<IMovieSchedulesWithTheaterDetails[] | never>;
    getTheaterScreenLayout(scheduleId: string): Promise<IMovieSchedulesForBooking | never>;
}