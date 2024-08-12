// interfaces
import { ObjectId } from "mongoose";
import { IDistributerList } from "../../entity/distributer.entity";
import IScreen, { ISeatCategory, ISeatLayout } from "../../entity/screen.entity";
import ITheater from "../../entity/theater.entity";
import { IAddScreenCredentials, IGetMovieListOfDistributerData } from "../controllers/theaterOwner.controller";

export default interface ITheaterOwnerUseCase {
    getDistributerList(): Promise<IDistributerList[] | never>;
    getMovieListOfDistributer(distributerId: string | undefined): Promise<IGetMovieListOfDistributerData | never>;
    addTheater(theaterOwnerId: string | undefined, name: string | undefined, images: string[] | undefined, licence: string | undefined): Promise<void | never>;
    getAllTheaters(theaterOwnerId: string): Promise<ITheater[] | never>;
    addScreen(data: IAddScreenCredentials, theaterId: string | undefined): Promise<void>;
    getAllScreens(theaterId: string | undefined): Promise<IScreen[] | never>;
    getTheater(theaterId: string): Promise<ITheater | never>;
}

export interface IScreenData {
    name: string;
    capacity: number;
    seatCategory: ISeatCategory[];
    seatLayout: (ISeatLayout | null)[][];
    theaterId: string | ObjectId;
}