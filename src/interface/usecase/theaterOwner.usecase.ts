// interfaces
import { IDistributerList } from "../../entity/distributer.entity";
import { IGetMovieListOfDistributerData } from "../controllers/theaterOwner.controller";

export default interface ITheaterOwnerUseCase {
    getDistributerList(): Promise<IDistributerList[] | never>;
    getMovieListOfDistributer(distributerId: string | undefined): Promise<IGetMovieListOfDistributerData | never>;
}