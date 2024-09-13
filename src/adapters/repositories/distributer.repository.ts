// collections
import Movies from "../../frameworks/models/movie.model";

// interfaces
import IMovie from "../../entity/movie.entity";
import IDistributerRepository from "../../interface/repositories/distributer.repository";
import Distributers from "../../frameworks/models/distributer.model";
import mongoose from "mongoose";
import MovieRequests from "../../frameworks/models/movieRequest.model";
import IMovieRequest, { IMovieRequestDetailsForDistributer } from "../../entity/movieRequest.entity";
import TheaterOwnerMovieCollections from "../../frameworks/models/theaterOwnerMovieCollection.model";
import { IDistributer, IDistributerList } from "../../entity/distributer.entity";
import MovieStreaming from "../../frameworks/models/movieStreaming.mode";
import IMovieStreaming, { IMovieStreamingDetails } from "../../entity/movieStreaming.entity";

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

    async getAllMovieRequests(distributerId: string): Promise<IMovieRequestDetailsForDistributer[] | never> {
        try {
            const agg = [
                {
                    $match: {
                        requestedMovieDistributerId: new mongoose.Types.ObjectId(distributerId),
                        requestStatus: "Pending"
                    }
                },
                {
                    $lookup: {
                        from: 'movies', 
                        localField: 'requestedMovieId', 
                        foreignField: '_id', 
                        as: 'movieData'
                    }
                }, 
                {
                    $unwind: {
                        path: '$movieData'
                    }
                }, 
                {
                    $lookup: {
                        from: 'theaterowners', 
                        localField: 'theaterOwnerId', 
                        foreignField: '_id', 
                        as: 'theaterOwnerData'
                    }
                }, 
                {
                    $unwind: {
                        path: '$theaterOwnerData'
                    }
                }
            ];

            return await MovieRequests.aggregate(agg);
        } catch (err: any) {
            throw err;
        }
    }


    async getDistributerById(id: string): Promise<IDistributerList | null | never> {
        try {
            return await Distributers.findOne({ _id: id }, { _id: 1, name: 1, distributedMoviesList: 1 });
        } catch (err: any) {
            throw err;
        }
    }
    
    async approveMovieRequest(requestId: string): Promise<IMovieRequest | null | never> {
        try {
          return await MovieRequests.findOneAndUpdate({ _id: requestId }, { $set: { requestStatus: "Approved" } }, { new: true });
        } catch (err: any) {
            throw err;
        }
    }

    async rejectMovieRequest(requestId: string): Promise<void | never> {
        try {
            await MovieRequests.findOneAndUpdate({ _id: requestId }, { $set: { requestStatus: "Rejected" } }, { new: true });
        } catch (err: any) {
            throw err;
        }
    }

    async addMovieToCollection(approvedRequest: IMovieRequest): Promise<void | never> {
        try {

            const movieValidity: Date = new Date(Date.now());
            movieValidity.setDate(movieValidity.getDate() + approvedRequest.timePeriod);

            const newMovieInCollection = new TheaterOwnerMovieCollections({
                movieDistributerId: approvedRequest.requestedMovieDistributerId,
                movieId: approvedRequest.requestedMovieId,
                profitSharingPerTicket: approvedRequest.profitSharingPerTicket,
                theaterOwnerId: approvedRequest.theaterOwnerId,
                timePeriod: approvedRequest.timePeriod,
                movieValidity
            });

            await newMovieInCollection.save();
        } catch (err: any) {
            throw err;
        }
    }

    async isMovieStreaming(movieId: string): Promise<IMovieStreaming | null | never> {
        try {
            return await MovieStreaming.findOne({ movieId: movieId });
        } catch (err: any) {
            throw err;            
        }
    }

    async addStreaming(movieId: string, rentalPeriod: number, rentAmount: number, buyAmount: number): Promise<void | never> {
        try {
            const newStreamingMovie = new MovieStreaming({
                buyAmount,
                movieId,
                rentalPeriod,
                rentAmount
            });

            await newStreamingMovie.save();
        } catch (err: any) {
            throw err;
        }
    }

    async getAllStreamingMovieDetails(distributerId: string): Promise<IMovieStreamingDetails[] | never> {
        try {
            const agg = [
                {
                  $lookup: {
                    from: 'movies', 
                    localField: 'movieId', 
                    foreignField: '_id', 
                    as: 'movieData'
                  }
                }, 
                {
                  $unwind: {
                    path: '$movieData'
                  }
                },
                {
                    $match: {
                        "movieData.distributerId": new mongoose.Types.ObjectId(distributerId)
                    }
                }
              ]

            return await MovieStreaming.aggregate(agg);
        } catch (err: any) {
            throw err;
        }
    }
}