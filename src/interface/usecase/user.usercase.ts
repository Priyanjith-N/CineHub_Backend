import IMovie, { INowPlayingMovies } from "../../entity/movie.entity";
import { IMovieSchedulesWithTheaterDetails } from "../../entity/movieSchedule.entity";

export default interface IUserUseCase {
    getAllDataForHomePage(): Promise<IHomeMovieData | never>;
    getMovieDetails(movieId: string | undefined): Promise<IMovie | never>;
    getAllShowsForAMovie(movieId: string | undefined): Promise<IMovieSchedulesWithTheaterDetails[] | never>;
}

export interface IHomeMovieData {
    nowPlayingMovies: INowPlayingMovies[];
    recommendedMovies: IMovie[];
    upcommingMovies: IMovie[];
}