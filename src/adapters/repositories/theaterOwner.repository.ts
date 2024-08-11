// collection
import Distributers from "../../frameworks/models/distributer.model";
import Movies from "../../frameworks/models/movie.model";

// interfaces
import ITheaterOwnerRepository from "../../interface/repositories/theaterOwnerRepository";
import { IDistributerList } from "../../entity/distributer.entity";
import IMovie from "../../entity/movie.entity";

export default class TheaterOwnerRepository implements ITheaterOwnerRepository {
    async getDistributerList(): Promise<IDistributerList[] | never> {
        try {
            return await Distributers.find({ documentVerificationStatus: "Approved", OTPVerificationStatus: true }, { name: 1, distributedMoviesList: 1 });
        } catch (err: any) {
            throw err;
        }
    }

    async getDistributerById(distributerId: string): Promise<IDistributerList | null | never> {
        try {
            return await Distributers.findOne({ _id: distributerId }, { name: 1, distributedMoviesList: 1 });
        } catch (err: any) {
            throw err;
        }
    }

    async getMovieListOfDistributer(distributerId: string): Promise<IMovie[] | never> {
        try {
            return await Movies.find({ distributerId });
        } catch (err: any) {
            throw err;
        }
    }
}