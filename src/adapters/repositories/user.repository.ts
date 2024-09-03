import mongoose from "mongoose";
import IMovie, { INowPlayingMovies } from "../../entity/movie.entity";
import Movies from "../../frameworks/models/movie.model";
import MovieSchedules from "../../frameworks/models/movieSchedule.model";
import IUserRepository from "../../interface/repositories/user.repository";
import { IMovieSchedulesForBooking, IMovieSchedulesWithTheaterDetails } from "../../entity/movieSchedule.entity";

export default class UserRepository implements IUserRepository {
    async upcommingMovies(): Promise<IMovie[] | never> {
        try {
            return await Movies.find({ releaseDate: { $gt: new Date(Date.now()) } });
        } catch (err: any) {
            throw err;
        }
    }

    async recommendedMovies(): Promise<IMovie[] | never> {
        try {
            return [];
        } catch (err: any) {
            throw err;
        }
    }

    async nowPlayingMovies(): Promise<INowPlayingMovies[] | never> {
        try {
            const agg = [
              {
                $group: {
                  _id: '$movieId'
                }
              }, 
              {
                $project: {
                  movieId: '$_id', 
                  _id: 0
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

            return await MovieSchedules.aggregate(agg);
        } catch (err: any) {
            throw err;
        }
    }

    async getMovieDetails(movieId: string): Promise<IMovie | null | never> {
        try {
            return await Movies.findOne({ _id: movieId });
        } catch (err: any) {
            throw err;
        }
    }

    async getAllShowsForAMovie(movieId: string): Promise<IMovieSchedulesWithTheaterDetails[] | never> {
        try {
          const agg = [
            {
              $match: {
                movieId: new mongoose.Types.ObjectId(movieId),
                date: {
                  $gte: new Date(Date.now())
                }
              }
            },
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
              $lookup: {
                from: 'theaters', 
                localField: 'screenData.theaterId', 
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
              $group: {
                _id: {
                  date: '$date', 
                  theaterId: '$theaterData._id'
                }, 
                scheduledDate: {
                  $first: '$date'
                }, 
                theaterData: {
                  $first: '$theaterData'
                }, 
                schedules: {
                  $push: {
                    scheduleId: '$_id', 
                    startTime: '$startTime', 
                    endTime: '$endTime',
                    availableSeats: '$availableSeats'
                  }
                }
              }
            }, 
            {
              $project: {
                _id: 0
              }
            }
          ]

          return await MovieSchedules.aggregate(agg);
        } catch (err: any) {
            throw err;
        }
    }

    async getTheaterScreenLayout(scheduleId: string): Promise<IMovieSchedulesForBooking | never> {
      try {
        const agg = [
          {
            $match: {
              _id: new mongoose.Types.ObjectId(scheduleId)
            }
          },
          {
            $lookup: {
              from: 'movies', 
              localField: 'movieId', 
              foreignField: '_id', 
              as: 'movieData'
            }
          }, {
            $unwind: {
              path: '$movieData'
            }
          }, 
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
            $lookup: {
              from: 'theaters', 
              localField: 'screenData.theaterId', 
              foreignField: '_id', 
              as: 'theaterData'
            }
          }, {
            $unwind: {
              path: '$theaterData'
            }
          }
        ];
  
        const [ schedule ]: IMovieSchedulesForBooking[] = await MovieSchedules.aggregate(agg);
  
        return schedule;
      } catch (err: any) {
        throw err;
      }
    }
}