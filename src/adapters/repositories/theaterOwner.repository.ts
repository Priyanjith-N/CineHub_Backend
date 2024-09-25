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
import IMovieRequest, { IMovieRequestCredentials, IMovieRequestDetails, IMovieReRequestCredentials } from "../../entity/movieRequest.entity";
import MovieRequests from "../../frameworks/models/movieRequest.model";
import mongoose from "mongoose";
import TheaterOwnerMovieCollections from "../../frameworks/models/theaterOwnerMovieCollection.model";
import ITheaterOwnerMovieCollection, { ITheaterOwnerMovieDetails } from "../../entity/theaterOwnerMovieCollection.entity";
import IMovieSchedule, { IMovieScheduleWithDetails, IScheduleCredentials, IScheduleSeatLayout } from "../../entity/movieSchedule.entity";
import MovieSchedules from "../../frameworks/models/movieSchedule.model";
import Tickets from "../../frameworks/models/tickets.model";

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
            return await TheaterOwnerMovieCollections.findOne({ theaterOwnerId, movieId, movieValidity: { $gte: new Date(Date.now()) } });
        } catch (err: any) {
            throw err;
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

    async reRequestUpdate(data: IMovieReRequestCredentials, movieRequestId: string): Promise<void | never> {
        try {
            await MovieRequests.updateOne({ _id: movieRequestId }, { $set: { profitSharingPerTicket: data.profitSharingPerTicket, timePeriod: data.timePeriod, requestStatus: "Pending" } });
        } catch (err: any) {
            throw err;
        }
    }

    async getAllRequests(theaterOwner: string): Promise<IMovieRequestDetails[] | never> {
        try {
            return await MovieRequests.aggregate(
                [
                    {
                        $match: {
                            theaterOwnerId: new mongoose.Types.ObjectId(theaterOwner)
                        }
                    },
                    {
                        $sort: {
                          date: -1
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
                ]
            );
        } catch (err: any) {
            throw err;
        }
    }

    async getAllOwnedMoviesFromCollection(theaterOwnerId: string): Promise<ITheaterOwnerMovieDetails[] | never> {
        try {
            const agg = [
                {
                    $match: {
                        theaterOwnerId: new mongoose.Types.ObjectId(theaterOwnerId),
                        movieValidity: { $gte: new Date(Date.now()) }
                    }
                },
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
                }
            ]

            return await TheaterOwnerMovieCollections.aggregate(agg);
        } catch (err: any) {
            throw err;
        }
    }

    async getScreenById(screenId: string): Promise<IScreen | null | never> {
        try {
            return await Screens.findOne({ _id: screenId });
        } catch (err: any) {
            throw err;
        }
    }

    async getAllMovieSchedule(screenId: string, theaterId: string): Promise<IMovieScheduleWithDetails[] | never> {
        try {
            return await MovieSchedules.aggregate(
                [
                    {
                      $lookup: {
                        from: 'screens', 
                        localField: 'screenId', 
                        foreignField: '_id', 
                        as: 'screenData'
                      }
                    }, 
                    {
                      $unwind: {
                        path: '$screenData'
                      }
                    },
                    {
                        $match: {
                            $and: [
                              { screenId: new mongoose.Types.ObjectId(screenId) },
                              { "screenData.theaterId": new mongoose.Types.ObjectId(theaterId) }
                            ]
                        } 
                    },
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
                      $group: {
                        _id: '$date', 
                        schedules: {
                          $push: {
                            _id: '$_id', 
                            movieData: '$movieData', 
                            startTime: '$startTime', 
                            endTime: '$endTime'
                          }
                        }
                      }
                    }, 
                    {
                      $project: {
                        schedules: 1, 
                        scheduledDate: '$_id', 
                        _id: 0
                      }
                    },
                    {
                        $sort: {
                            scheduledDate: 1
                        }
                    }
                ]
            );
        } catch (err: any) {
            throw err;
        }
    }

    async addMovieSchedule(data: IScheduleCredentials, seatLayout: (IScheduleSeatLayout | null)[][], totalCapacity: number): Promise<void | never> {
        try {
            const newSchedule = new MovieSchedules({
                date: new Date(data.date!),
                screenId: data.screenId,
                movieId: data.movieId,
                startTime: data.startTime,
                endTime: data.endTime,
                seats: seatLayout,
                availableSeats: totalCapacity
            });

            await newSchedule.save();
        } catch (err: any) {
            throw err;
        }
    }

    async getAllSchedulesBasedOnDates(screenId: string, date: Date): Promise<IMovieSchedule[] | never> {
        try {
            return await MovieSchedules.find({ screenId, date: new Date(date) });
        } catch (err: any) {
            throw err;
        }
    }

    async getTotalActiveMovieCount(theaterOwnerId: string): Promise<number | never> {
        try {
            return  await TheaterOwnerMovieCollections.countDocuments({ theaterOwnerId, movieValidity: { $gte: new Date(Date.now()) } });
        } catch (err: any) {
            throw err;
        }
    }

    async getTotalOverallBooking(theaterOwnerId: string): Promise<number | never> {
        try {
            return (await Tickets.aggregate(
                [
                    {
                      $match: {
                        paymentStatus: 'Successfull', 
                        ticketStatus: 'Succeed'
                      }
                    }, 
                    {
                      $lookup: {
                        from: 'theaters', 
                        localField: 'theaterId', 
                        foreignField: '_id', 
                        as: 'theaterData'
                      }
                    }, 
                    {
                      $unwind: {
                        path: '$theaterData'
                      }
                    }, 
                    {
                      $match: {
                        "theaterData.ownerId": new mongoose.Types.ObjectId(theaterOwnerId)
                      }
                    }
                ]
            )).length;
        } catch (err: any) {
            throw err;
        }
    }

    async getTotalPendingRequest(theaterOwnerId: string): Promise<number | never> {
        try {
            return await MovieRequests.countDocuments({ theaterOwnerId, requestStatus: "Pending" });
        } catch (err: any) {
            throw err;
        }
    }
}