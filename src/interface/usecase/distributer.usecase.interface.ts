// interfaces
import IMovie from "../../entity/movie.entity";
import { IMovieRequestDetailsForDistributer } from "../../entity/movieRequest.entity";
import { IMovieStreamingCredentials, IMovieStreamingDetails } from "../../entity/movieStreaming.entity";

export default interface IDistributerUseCase {
    getAllAvailableMovies(): Promise<IMovie[] | never>;
    distributeMovie(distributerId: string | undefined, movieId: string | undefined, releaseDate:  Date | undefined, profitSharingPerTicket: number | undefined): Promise<void | never>;
    getDistributedMovies(distributerId: string | undefined): Promise<IMovie[] | never>;
    editProfitSharingOfDistributedMovie(distributerId: string | undefined, movieId: string | undefined, releaseDate:  Date | undefined, profitSharingPerTicket: number | undefined): Promise<void | never>;
    getAllMovieRequests(distributerId: string | undefined): Promise<IMovieRequestDetailsForDistributer[] | never>;
    approveMovieRequest(requestId: string | undefined, theaterOwnerEmail: string | undefined, movieName: string | undefined): Promise<void | never>;
    rejectMovieRequest(requestId: string | undefined, theaterOwnerEmail: string | undefined, movieName: string | undefined, reason: string | undefined): Promise<void | never>;
    addStreaming(data: IMovieStreamingCredentials): Promise<void | never>;
    editStreaming(data: IMovieStreamingCredentials, streamingId: string | undefined): Promise<void | never>;
    deleteStreaming(streamingId: string | undefined): Promise<void | never>;
    getAllStreamingMovieDetails(distributerId: string | undefined): Promise<IMovieStreamingDetails[] | never>;
}