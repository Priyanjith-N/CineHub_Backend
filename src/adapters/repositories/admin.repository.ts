import mongoose from "mongoose";

// collections
import Users from "../../frameworks/models/user.model";
import TheaterOwners from "../../frameworks/models/theaterOwner.model";
import Distributers from "../../frameworks/models/distributer.model";
import Movies from "../../frameworks/models/movie.model";

// interfaces
import { IAdminRepository, INotVerifiedDistributers, INotVerifiedTheaterOwners } from "../../interface/repositories/admin.repository.interface";
import IMovie, { IMovieData } from "../../entity/movie.entity";
import { IDistributer } from "../../entity/distributer.entity";
import ITheaterOwner from "../../entity/theaterOwner.entity";
import IUser from "../../entity/user.entity";
import Tickets from "../../frameworks/models/tickets.model";
import { ITop10Distributers, ITop10Movies, ITop10Theaters } from "../../entity/admin.entity";
import Theaters from "../../frameworks/models/theater.model";

export default class AdminRepository implements IAdminRepository {
    
    async allUser(): Promise<IUser[] | never> {
        try {
            return await Users.find({}, { password: 0 });
        } catch (err: any) {
            throw err;
        }
    }

    async allTheaterOwners(): Promise<ITheaterOwner[] | never> {
        try {
            return await TheaterOwners.find({}, { password: 0 });
        } catch (err: any) {
            throw err;
        }
    }

    async allDistributers(): Promise<IDistributer[] | never> {
        try {
            return await Distributers.find({}, { password: 0 });
        } catch (err: any) {
            throw err;
        }
    }

    async updateUserIsBlockedStatus(id: string, isBlocked: boolean): Promise<void | null> {
        try {
            await Users.updateOne({ _id: id }, { $set: { isBlocked } });
        } catch (err: any) {
            throw err;
        }
    }

    async updateTheaterOwnerIsBlockedStatus(id: string, isBlocked: boolean): Promise<void | null> {
        try {
            await TheaterOwners.updateOne({ _id: id }, { $set: { isBlocked } });
        } catch (err: any) {
            throw err;
        }
    }

    async updateDistributerIsBlockedStatus(id: string, isBlocked: boolean): Promise<void | null> {
        try {
            await Distributers.updateOne({ _id: id }, { $set: { isBlocked } });
        } catch (err: any) {
            throw err;
        }
    }

    async getAllDocumentVerificationPendingData(): Promise<(INotVerifiedDistributers | INotVerifiedTheaterOwners)[]> {
        try {
            const theaterOwners: INotVerifiedTheaterOwners[] = await TheaterOwners.aggregate(
                [
                    {
                        $match: {
                          'OTPVerificationStatus': true,
                          'documentVerificationStatus': 'Pending'
                        }
                    },
                    {
                        $addFields: {
                          role: 'Theater Owner'
                        }
                    },
                    {
                        $project: {
                            pasword: 0
                        }
                    }
                ]
            );

            const distributer: INotVerifiedDistributers[] = await Distributers.aggregate(
                [
                    {
                        $match: {
                          'OTPVerificationStatus': true,
                          'documentVerificationStatus': 'Pending'
                        }
                    },
                    {
                        $addFields: {
                          role: 'Distributer'
                        }
                    },
                    {
                        $project: {
                            pasword: 0
                        }
                    }
                ]
            );

            return [...theaterOwners, ...distributer];
        } catch (err: any) {
            throw err;
        }
    }

    async changeDocumentVerificationStatusTheaterOwner(id: string, status: string): Promise<string | undefined | never> {
        try {
            const updatedData: ITheaterOwner | null = await TheaterOwners.findOneAndUpdate({ _id: id }, { $set: { documentVerificationStatus: status } }, { new: true });

            return updatedData?.email;
        } catch (err: any) {
            throw err;
        }
    }

    async changeDocumentVerificationStatusDistributer(id: string, status: string): Promise<string | undefined | never> {
        try {
            console.log(status);
            
            const updatedData: IDistributer | null = await Distributers.findOneAndUpdate({ _id: id }, { $set: { documentVerificationStatus: status } }, { new: true });

            return updatedData?.email;
        } catch (err: any) {
            throw err;
        }
    }

    async getTheaterOwner(id: string): Promise<INotVerifiedTheaterOwners | undefined | never> {
        try {
            const [ data ]: INotVerifiedTheaterOwners[] = await TheaterOwners.aggregate(
                [
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(id)
                        }
                    },
                    {
                        $addFields: {
                          role: 'Theater Owner'
                        }
                    },
                    {
                        $project: {
                            pasword: 0
                        }
                    }
                ]
            );

            return data;
        } catch (err: any) {
            throw err;
        }
    }

    async getDistributer(id: string): Promise<INotVerifiedDistributers | undefined | never> {
        try {
            const [ data ]: INotVerifiedDistributers[] = await Distributers.aggregate(
                [
                    {
                        $match: {
                            _id: new mongoose.Types.ObjectId(id)
                        }
                    },
                    {
                        $addFields: {
                          role: 'Distributer'
                        }
                    },
                    {
                        $project: {
                            pasword: 0
                        }
                    }
                ]
            );

            return data;
        } catch (err: any) {
            throw err;
        }
    }

    async getMovieByName(name: string): Promise<IMovie | null | never> {
        try {
            return await Movies.findOne({ name: { $regex : new RegExp(name, "i") } });
        } catch (err: any) {
            throw err;
        }
    }

    async saveMovie(movieData: IMovieData): Promise<void | never> {
        try {
            const newMovie = new Movies({
                name: movieData.name,
                about: movieData.about,
                language: movieData.language,
                duration: movieData.duration,
                coverPhoto: movieData.coverPhoto,
                bannerPhoto: movieData.bannerPhoto,
                trailer: movieData.trailer,
                category: movieData.category,
                type: movieData.type,
                cast: movieData.cast,
                crew: movieData.crew
            });

            await newMovie.save();
        } catch (err: any) {
            throw err;
        }
    }

    async getMovie(movieId: string): Promise<IMovie | null | never> {
        try {
            return await Movies.findOne({ _id: movieId });
        } catch (err: any) {
            throw err;
        }
    }

    async getAllMovies(page: number, isListed: boolean, limit: number): Promise<IMovie[] | never> {
        try {
            const skipNumber: number = (page - 1) * limit;
            return await Movies.find({ isListed }).skip(skipNumber).limit(limit);
        } catch (err: any) {
            throw err;
        }
    }

    async getTotalMovieCount(isListed: boolean): Promise<number | never> {
        try {
            return await Movies.find({ isListed }).countDocuments();
        } catch (err: any) {
            throw err;
        }
    }

    async makeMovieAsListedOrUnlisted(id: string, status: boolean): Promise<void | never> {
        try {
            await Movies.updateOne({ _id: id }, { $set: { isListed: status } });
        } catch (err: any) {
            throw err;
        }
    }

    async updateMovie(movieId: string, movieData: IMovieData): Promise<void | never> {
        try {
            await Movies.updateOne({ _id: movieId }, { $set: {
                name: movieData.name,
                about: movieData.about,
                language: movieData.language,
                duration: movieData.duration,
                coverPhoto: movieData.coverPhoto,
                bannerPhoto: movieData.bannerPhoto,
                trailer: movieData.trailer,
                category: movieData.category,
                type: movieData.type,
                cast: movieData.cast,
                crew: movieData.crew
            } });
        } catch (err: any) {
            throw err;
        }
    }

    async getTheaterCount(): Promise<number | never> {
        try {
            return await Theaters.countDocuments();
        } catch (err: any) {
            throw err;
        }
    }

    async getDistributerCount(): Promise<number | never> {
        try {
            return await Distributers.countDocuments();
        } catch (err: any) {
            throw err;
        }
    }

    async getMoviesCount(): Promise<number | never> {
        try {
            return await Movies.countDocuments();
        } catch (err: any) {
            throw err;
        }
    }

    async getTop10Movies(): Promise<ITop10Movies[] | never> {
        try {
            return await Tickets.aggregate(
                [
                    {
                      $match: {
                        paymentStatus: 'Successfull'
                      }
                    }, 
                    {
                      $group: {
                        _id: '$movieId', 
                        totalTicketSold: {
                          $sum: 1
                        }, 
                        amount: {
                          $sum: '$totalPaidAmount'
                        }
                      }
                    }, 
                    {
                      $sort: {
                        totalTicketSold: -1,
                        amount: -1
                      }
                    }, 
                    {
                      $limit: 10
                    }, 
                    {
                      $project: {
                         _id: 0, 
                         movieId: '$_id', 
                         amount: 1, 
                         totalTicketSold: 1
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
                      $project: {
                        movieId: 0
                      }
                    }
                ]
            );
        } catch (err: any) {
            throw err;
        }
    }

    async getTop10Distributers(): Promise<ITop10Distributers[] | never> {
        try {
            return await Tickets.aggregate(
                [
                    {
                      $match: {
                        paymentStatus: 'Successfull'
                      }
                    }, 
                    {
                      $group: {
                        _id: "$movieId", 
                        totalTicketSold: {
                          $sum: 1
                        }, 
                        amount: {
                          $sum: '$totalPaidAmount'
                        }
                      }
                    }, 
                    {
                      $project: {
                        _id: 0, 
                        movieId: '$_id', 
                        totalTicketSold: 1, 
                        amount: 1
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
                        _id: '$movieData.distributerId', 
                        amount: {
                          $sum: '$amount'
                        }, 
                        totalTicketSold: {
                          $sum: '$totalTicketSold'
                        }
                      }
                    }, 
                    {
                      $sort: {
                        totalTicketSold: -1, 
                        amount: -1
                      }
                    }, 
                    {
                      $limit: 10
                    }, 
                    {
                      $project: {
                        _id: 0, 
                        distributerId: '$_id', 
                        amount: 1
                      }
                    }, 
                    {
                      $lookup: {
                        from: 'distributers', 
                        localField: 'distributerId', 
                        foreignField: '_id', 
                        as: 'distributerData'
                      }
                    }, 
                    {
                      $unwind: {
                        path: '$distributerData'
                      }
                    },
                    {
                        $project: {
                          distributerId: 0
                        }
                    }
                ]
            );
        } catch (err: any) {
            throw err;
        }
    }

    async getTop10Theaters(): Promise<ITop10Theaters[] | never> {
        try {
            return await Tickets.aggregate(
                [
                    {
                      $match: {
                        paymentStatus: 'Successfull'
                      }
                    }, 
                    {
                      $group: {
                        _id: '$theaterId', 
                        totalTicketSold: {
                          $sum: 1
                        }, 
                        amount: {
                          $sum: '$totalPaidAmount'
                        }
                      }
                    }, 
                    {
                      $sort: {
                        totalTicketSold: -1, 
                        amount: -1
                      }
                    }, 
                    {
                      $limit: 10
                    }, 
                    {
                      $project: {
                        _id: 0, 
                        theaterId: '$_id', 
                        totalTicketSold: 1, 
                        amount: 1
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
                      $project: {
                        theaterId: 0,
                        totalTicketSold: 0
                      }
                    }
                ]
            );
        } catch (err: any) {
            throw err;
        }
    }
}