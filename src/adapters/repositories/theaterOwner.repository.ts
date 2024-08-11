// collection
import Distributers from "../../frameworks/models/distributer.model";
import Movies from "../../frameworks/models/movie.model";

// interfaces
import ITheaterOwnerRepository from "../../interface/repositories/theaterOwnerRepository";
import { IDistributerList } from "../../entity/distributer.entity";
import IMovie from "../../entity/movie.entity";
import { IAddTheaterCredentials } from "../../interface/controllers/theaterOwner.controller";
import Theaters from "../../frameworks/models/theater.model";
import ITheater from "../../entity/theater.entity";

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

    async getTheaterByName(name: string): Promise<ITheater | null | never> {
        try {
            return await Theaters.findOne({ name });
        } catch (err: any) {
            throw err;
        }
    }

    async saveTheater(data: IAddTheaterCredentials): Promise<void | never> {
        try {
            const newTheater = new Theaters({
                name: data.name,
                images: data.images,
                ownerId: data.theaterOwnerId,
                licence: data.licence
            });

            await newTheater.save();
        } catch (err: any) {
            throw err;
        }
    }
}