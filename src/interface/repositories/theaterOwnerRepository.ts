// interfaces
import { IDistributerList } from "../../entity/distributer.entity";
import IMovie from "../../entity/movie.entity";

export default interface ITheaterOwnerRepository {
    getDistributerList(): Promise<IDistributerList[] | never>;
    getDistributerById(distributerId: string): Promise<IDistributerList | null | never>;
    getMovieListOfDistributer(distributerId: string): Promise<IMovie[] | never>;
}