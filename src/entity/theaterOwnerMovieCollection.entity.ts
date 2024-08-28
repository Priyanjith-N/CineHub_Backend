import { Schema } from "mongoose";
import IMovie from "./movie.entity";

export default interface ITheaterOwnerMovieCollection {
    _id: string;
    profitSharingPerTicket: number;
    timePeriod: number;
    movieId: string | Schema.Types.ObjectId;
    movieDistributerId: string | Schema.Types.ObjectId;
    theaterOwnerId: string | Schema.Types.ObjectId;
    movieValidity: Date;
}

export interface ITheaterOwnerMovieDetails extends ITheaterOwnerMovieCollection {
    movieData: IMovie;
}