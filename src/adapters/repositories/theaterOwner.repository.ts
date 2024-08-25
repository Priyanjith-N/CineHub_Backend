// collection
import Distributers from "../../frameworks/models/distributer.model";
import Movies from "../../frameworks/models/movie.model";

// interfaces
import ITheaterOwnerRepository from "../../interface/repositories/theaterOwnerRepository.interface";
import { IDistributerList } from "../../entity/distributer.entity";
import IMovie from "../../entity/movie.entity";
import { IAddTheaterCredentials } from "../../interface/controllers/theaterOwner.controller";
import Theaters from "../../frameworks/models/theater.model";
import ITheater from "../../entity/theater.entity";
import IScreen from "../../entity/screen.entity";
import Screens from "../../frameworks/models/screen.model";
import { IScreenData } from "../../interface/usecase/theaterOwner.usecase";
import IMovieRequest, { IMovieRequestCredentials, IMovieRequestDetails } from "../../entity/movieRequest.entity";
import MovieRequests from "../../frameworks/models/movieRequest.model";
import mongoose from "mongoose";
import TheaterOwnerMovieCollections from "../../frameworks/models/theaterOwnerMovieCollection.model";
import ITheaterOwnerMovieCollection from "../../entity/theaterOwnerMovieCollection.entity";

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
                licence: data.licence,
                location: data.location
            });

            await newTheater.save();
        } catch (err: any) {
            throw err;
        }
    }

    async getTheatersByOwnerId(theaterOwnerId: string): Promise<ITheater[] | never> {
        try {
            return await Theaters.find({ ownerId: theaterOwnerId });
        } catch (err: any) {
            throw err;
        }
    }

    async getTheaterById(_id: string): Promise<ITheater | null | never> {
        try {
            return await Theaters.findOne({ _id }, { licence: 0 });
        } catch (err: any) {
            throw err;
        }
    }

    async getScreenByName(name: string, theaterId: string): Promise<IScreen | null | never> {
        try {
            return await Screens.findOne({ name: { $regex : new RegExp(name, "i") }, theaterId });
        } catch (err: any) {
            throw err;
        }
    }

    async saveScreen(data: IScreenData): Promise<void | never> {
        try {
            const newScreen = new Screens({
                name: data.name,
                capacity: data.capacity,
                seatCategory: data.seatCategory,
                seatLayout: data.seatLayout,
                theaterId: data.theaterId
            });

            await newScreen.save();
            await Theaters.updateOne({ _id: data.theaterId }, { $inc: { numberOfScreen: 1 } });
        } catch (err: any) {
            throw err;
        }
    }

    async getAllScreens(theaterId: string): Promise<IScreen[] | never> {
        try {
            return await Screens.find({ theaterId });
        } catch (err: any) {
            throw err;
        }
    }

    async isAlreadyRequested(movieId: string, theaterOwnerId: string): Promise<IMovieRequest | null | never> {
        try {
            return await MovieRequests.findOne({ requestedMovieId: movieId, theaterOwnerId, requestStatus: "Pending" });
        } catch (err: any) {
            throw err;
        }
    }

    async isAlreadyInCollection(movieId: string, theaterOwnerId: string): Promise<ITheaterOwnerMovieCollection | null | never> {
        try {
            await this.deleteAllDueValiditiyMovies();

            return await TheaterOwnerMovieCollections.findOne({ theaterOwnerId, movieId });
        } catch (err: any) {
            throw err;
        }
    }

    private async deleteAllDueValiditiyMovies(): Promise<void | never> {
        try {
            const currentData: Date = new Date(Date.now());

            await TheaterOwnerMovieCollections.deleteMany({ movieValidity: { $gt: { currentData } } })
        } catch (err: any) {
            
        }
    }

    async saveRequest(data: IMovieRequestCredentials): Promise<void | never> {
        try {
            const newRequest = new MovieRequests({
                profitSharingPerTicket: data.profitSharingPerTicket,
                timePeriod: data.timePeriod,
                requestedMovieDistributerId: data.requestedMovieDistributerId,
                requestedMovieId: data.requestedMovieId,
                theaterOwnerId: data.theaterOwnerId,
                date: new Date(Date.now())
            });

            await newRequest.save();
        } catch (err: any) {
            throw err;
        }
    }

    async getAllRequests(theaterOwner: string): Promise<IMovieRequestDetails[] | never> {
        try {
            const agg = [
                {
                    $match: {
                        theaterOwnerId: new mongoose.Types.ObjectId(theaterOwner)
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
                        from: 'distributers', 
                        localField: 'requestedMovieDistributerId', 
                        foreignField: '_id', 
                        as: 'distributerData'
                    }
                }, 
                {
                    $unwind: {
                        path: '$distributerData'
                    }
                }
            ];

            return await MovieRequests.aggregate(agg);
        } catch (err: any) {
            throw err;
        }
    }
}