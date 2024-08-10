// collections
import Movies from "../../frameworks/models/movie.model";

// interfaces
import IMovie from "../../entity/movie.entity";
import IDistributerRepository from "../../interface/repositories/distributer.repository";
import Distributers from "../../frameworks/models/distributer.model";

export default class DistributerRepository implements IDistributerRepository {
    async getAllAvailableMovies(): Promise<IMovie[] | never> {
        try {
            return await Movies.find({ isTakenByDistributer: false, isListed: true });
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
            await Distributers.updateOne({ _id: distributerId }, { $push: { distributedMoviesList: movieId }});
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

    async editProfitSharingOfDistributedMovie(distributerId: string, movieId: string, releaseDate: Date, profitSharingPerTicket: number): Promise<void | never> {
        try {
            await Movies.updateOne({ _id: movieId, distributerId }, { $set: { releaseDate, profitSharingPerTicket } });
        } catch (err: any) {
            throw err;
        }
    }
}