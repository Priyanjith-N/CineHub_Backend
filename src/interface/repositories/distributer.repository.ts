// interfaces
import IMovie from "../../entity/movie.entity";

export default interface IDistributerRepository {
    getAllAvailableMovies(): Promise<IMovie[] | never>;
    isDistributed(id: string): Promise<IMovie | null | never>;
    distributeMovie(distributerId: string, movieId: string, releaseDate: Date, profitSharingPerTicket: number): Promise<void | never>;
    getDistibutedMovies(distributerId: string): Promise<IMovie[] | never>;
}