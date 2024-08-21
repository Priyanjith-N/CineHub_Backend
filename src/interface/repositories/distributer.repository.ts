// interfaces
import { IDistributerList } from "../../entity/distributer.entity";
import IMovie from "../../entity/movie.entity";
import IMovieRequest, { IMovieRequestDetailsForDistributer } from "../../entity/movieRequest.entity";

export default interface IDistributerRepository {
    getAllAvailableMovies(): Promise<IMovie[] | never>;
    isDistributed(id: string): Promise<IMovie | null | never>;
    distributeMovie(distributerId: string, movieId: string, releaseDate: Date, profitSharingPerTicket: number): Promise<void | never>;
    getDistibutedMovies(distributerId: string): Promise<IMovie[] | never>;
    editProfitSharingOfDistributedMovie(distributerId: string, movieId: string, releaseDate: Date, profitSharingPerTicket: number): Promise<void | never>;
    getAllMovieRequests(distributerId: string): Promise<IMovieRequestDetailsForDistributer[] | never>;
    getDistributerById(id: string): Promise<IDistributerList | null | never>;
    approveMovieRequest(requestId: string): Promise<IMovieRequest | null | never>;
    addMovieToCollection(approvedRequest: IMovieRequest): Promise<void | never>;
    rejectMovieRequest(requestId: string): Promise<void | never>;
}