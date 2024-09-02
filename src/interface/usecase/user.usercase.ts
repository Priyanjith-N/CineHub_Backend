import IMovie, { INowPlayingMovies } from "../../entity/movie.entity";

export default interface IUserUseCase {
    getAllDataForHomePage(): Promise<IHomeMovieData | never>;
    getMovieDetails(movieId: string | undefined): Promise<IMovie | never>;
}

export interface IHomeMovieData {
    nowPlayingMovies: INowPlayingMovies[];
    recommendedMovies: IMovie[];
    upcommingMovies: IMovie[];
}