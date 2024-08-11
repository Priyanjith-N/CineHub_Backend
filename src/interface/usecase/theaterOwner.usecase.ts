// interfaces
import { IDistributerList } from "../../entity/distributer.entity";
import ITheater from "../../entity/theater.entity";
import { IGetMovieListOfDistributerData } from "../controllers/theaterOwner.controller";

export default interface ITheaterOwnerUseCase {
    getDistributerList(): Promise<IDistributerList[] | never>;
    getMovieListOfDistributer(distributerId: string | undefined): Promise<IGetMovieListOfDistributerData | never>;
    addTheater(theaterOwnerId: string | undefined, name: string | undefined, images: string[] | undefined, licence: string | undefined): Promise<void | never>;
    getAllTheaters(theaterOwnerId: string): Promise<ITheater[] | never>;
}