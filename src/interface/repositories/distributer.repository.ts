// interfaces
import IMovie from "../../entity/movie.entity";
import { IMovieRequestDetailsForDistributer } from "../../entity/movieRequest.entity";

export default interface IDistributerRepository {
    getAllAvailableMovies(): Promise<IMovie[] | never>;
    isDistributed(id: string): Promise<IMovie | null | never>;
    distributeMovie(distributerId: string, movieId: string, releaseDate: Date, profitSharingPerTicket: number): Promise<void | never>;
    getDistibutedMovies(distributerId: string): Promise<IMovie[] | never>;
    editProfitSharingOfDistributedMovie(distributerId: string, movieId: string, releaseDate: Date, profitSharingPerTicket: number): Promise<void | never>;
    getAllMovieRequests(distributerId: string): Promise<IMovieRequestDetailsForDistributer[] | never>;
}