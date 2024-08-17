import { Schema } from "mongoose";
import { IDistributer } from "./distributer.entity";
import IMovie from "./movie.entity";

export default interface IMovieRequest {
    _id: string;
    profitSharingPerTicket: number;
    timePeriod: number;
    requestedMovieId: string | Schema.Types.ObjectId;
    requestedMovieDistributerId: string | Schema.Types.ObjectId;
    theaterOwnerId: string | Schema.Types.ObjectId;
    requestStatus: "Pending" | "Approved" | "Rejected";
    date: Date;
}

export interface IMovieRequestCredentials {
    profitSharingPerTicket: number | undefined;
    timePeriod: number | undefined;
    requestedMovieId:  | undefined;
    requestedMovieDistributerId: string | undefined;
    theaterOwnerId: string | undefined;
}

export interface IMovieRequestDetails extends IMovieRequest {
    distributerData: IDistributer,
    movieData: IMovie
}