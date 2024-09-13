import { ObjectId } from "mongoose";
import IMovie from "./movie.entity";

export default interface IMovieStreaming {
    _id: string;
    movieId: string | ObjectId;
    rentAmount: number;
    rentalPeriod: number;
    buyAmount: number;
}

export interface IMovieStreamingCredentials {
    movieId: string | undefined;
    rentAmount: number | undefined;
    rentalPeriod: number | undefined;
    buyAmount: number | undefined;
}

export interface IMovieStreamingDetails extends IMovieStreaming {
    movieData: IMovie;
}