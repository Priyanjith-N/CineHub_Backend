import IMovie, { INowPlayingMovies } from "../../entity/movie.entity";

export default interface IUserRepository {
    upcommingMovies(): Promise<IMovie[] | never>;
    recommendedMovies(): Promise<IMovie[] | never>;
    nowPlayingMovies(): Promise<INowPlayingMovies[] | never>;
    getMovieDetails(movieId: string): Promise<IMovie | null | never>;
}