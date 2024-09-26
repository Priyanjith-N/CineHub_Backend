// interfaces
import { IDistributerList, IMovieDeatilsWithRevenue } from "../../entity/distributer.entity";
import IMovie from "../../entity/movie.entity";
import IMovieRequest, { IMovieRequestDetailsForDistributer } from "../../entity/movieRequest.entity";
import IMovieStreaming, { IMovieStreamingDetails } from "../../entity/movieStreaming.entity";

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
    isMovieStreaming(movieId: string): Promise<IMovieStreaming | null | never>;
    addStreaming(movieId: string, rentalPeriod: number, rentAmount: number, buyAmount: number): Promise<void | never>;
    editStreaming(movieId: string, rentalPeriod: number, rentAmount: number, buyAmount: number, streamingId: string): Promise<void | never>;
    deleteStreaming(streamingId: string): Promise<void | never>;
    getAllStreamingMovieDetails(distributerId: string): Promise<IMovieStreamingDetails[] | never>;
    getTotalMoviesDistributedCount(distributerId: string): Promise<number | never>;
    getTotalMoviesStreamingCount(distributerId: string): Promise<number | never>;
    getTotalNewPendingRequestCount(distributerId: string): Promise<number | never>;
    getMoviesAndRevenueMade(distributerId: string): Promise<IMovieDeatilsWithRevenue[] | never>;
}