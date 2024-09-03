import { isObjectIdOrHexString } from "mongoose";
import IMovie, { INowPlayingMovies } from "../entity/movie.entity";
import { IMovieSchedulesWithTheaterDetails } from "../entity/movieSchedule.entity";
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import IUserRepository from "../interface/repositories/user.repository";
import IUserUseCase, { IHomeMovieData } from "../interface/usecase/user.usercase";

export default class UserUseCase implements IUserUseCase {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async getAllDataForHomePage(): Promise<IHomeMovieData | never> {
        try {
            const nowPlayingMovies: INowPlayingMovies[] = await this.userRepository.nowPlayingMovies();
            const recommendedMovies: IMovie[] = await this.userRepository.recommendedMovies();
            const upcommingMovies: IMovie[] = await this.userRepository.upcommingMovies();

            const data: IHomeMovieData = {
                nowPlayingMovies,
                recommendedMovies,
                upcommingMovies
            }

            return data;
        } catch (err: any) {
            throw err;
        }
    }

    async getMovieDetails(movieId: string | undefined): Promise<IMovie | never> {
        try {
            if(!movieId) throw new RequiredCredentialsNotGiven('Provide all required details.');

            const data: IMovie | null = await this.userRepository.getMovieDetails(movieId);

            if(!data) throw new RequiredCredentialsNotGiven('Provide all required details.');

            return data;
        } catch (err: any) {
            throw err;
        }
    }

    async getAllShowsForAMovie(movieId: string | undefined): Promise<IMovieSchedulesWithTheaterDetails[] | never> {
        try {
            if(!movieId || !isObjectIdOrHexString(movieId)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            return await this.userRepository.getAllShowsForAMovie(movieId);
        } catch (err: any) {
            throw err;
        }
    }
}