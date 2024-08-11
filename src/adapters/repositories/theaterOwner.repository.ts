// collection
import { IDistributerList } from "../../entity/distributer.entity";
import Distributers from "../../frameworks/models/distributer.model";

// interfaces
import ITheaterOwnerRepository from "../../interface/repositories/theaterOwnerRepository";

export default class TheaterOwnerRepository implements ITheaterOwnerRepository {
    async getDistributerList(): Promise<IDistributerList[] | never> {
        try {
            return await Distributers.find({ documentVerificationStatus: "Approved", OTPVerificationStatus: true }, { name: 1, distributedMoviesList: 1 });
        } catch (err: any) {
            throw err;
        }
    }
}