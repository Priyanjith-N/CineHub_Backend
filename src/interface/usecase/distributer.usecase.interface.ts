// interfaces
import IMovie from "../../entity/movie.entity";

export default interface IDistributerUseCase {
    getAllAvailableMovies(): Promise<IMovie[] | never>;
    distributeMovie(distributerId: string | undefined, movieId: string | undefined, releaseDate:  Date | undefined, profitSharingPerTicket: number | undefined): Promise<void | never>;
    getDistributedMovies(distributerId: string | undefined): Promise<IMovie[] | never>;
}