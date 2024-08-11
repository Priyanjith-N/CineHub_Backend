// interfaces
import { IDistributerList } from "../../entity/distributer.entity";
import IMovie from "../../entity/movie.entity";
import ITheater from "../../entity/theater.entity";
import { IAddTheaterCredentials } from "../controllers/theaterOwner.controller";

export default interface ITheaterOwnerRepository {
    getDistributerList(): Promise<IDistributerList[] | never>;
    getDistributerById(distributerId: string): Promise<IDistributerList | null | never>;
    getMovieListOfDistributer(distributerId: string): Promise<IMovie[] | never>;
    getTheaterByName(name: string): Promise<ITheater | null | never>;
    saveTheater(data: IAddTheaterCredentials): Promise<void | never>;
}