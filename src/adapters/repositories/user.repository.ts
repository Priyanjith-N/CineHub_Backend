import IMovie, { INowPlayingMovies } from "../../entity/movie.entity";
import Movies from "../../frameworks/models/movie.model";
import MovieSchedules from "../../frameworks/models/movieSchedule.model";
import IUserRepository from "../../interface/repositories/user.repository";

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
                  $match: {
                    date: {
                      $lte: new Date(Date.now())
                    }
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
                    _id: 0, 
                    date: 0, 
                    screenId: 0, 
                    movieId: 0, 
                    seats: 0, 
                    startTime: 0, 
                    endTime: 0
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
}