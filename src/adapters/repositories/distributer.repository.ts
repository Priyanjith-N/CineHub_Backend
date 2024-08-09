// collections
import Movies from "../../frameworks/models/movie.model";

// interfaces
import IMovie from "../../entity/movie.entity";
import IDistributerRepository from "../../interface/repositories/distributer.repository";

export default class DistributerRepository implements IDistributerRepository {
    async getAllAvailableMovies(): Promise<IMovie[] | never> {
        try {
            return await Movies.find({ isTakenByDistributer: false });
        } catch (err: any) {
            throw err;
        }
    }

    async isDistributed(id: string): Promise<IMovie | null | never> {
        try {
            return await Movies.findOne({ _id: id, isTakenByDistributer: true });
        } catch (err: any) {
            throw err;
        }
    }

    async distributeMovie(distributerId: string, movieId: string, releaseDate: Date, profitSharingPerTicket: number): Promise<void | never> {
        try {
            await Movies.updateOne({ _id: movieId }, { $set: { isTakenByDistributer: true, distributerId: distributerId, releaseDate, profitSharingPerTicket } });
        } catch (err: any) {
            throw err;
        }
    }

    async getDistibutedMovies(distributerId: string): Promise<IMovie[] | never> {
        try {
            return await Movies.find({ distributerId });
        } catch (err: any) {
            throw err;
        }
    }
}