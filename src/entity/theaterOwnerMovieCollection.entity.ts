import { Schema } from "mongoose";

export default interface ITheaterOwnerMovieCollection {
    _id: string;
    profitSharingPerTicket: number;
    timePeriod: number;
    movieId: string | Schema.Types.ObjectId;
    movieDistributerId: string | Schema.Types.ObjectId;
    theaterOwnerId: string | Schema.Types.ObjectId;
    movieValidity: Date;
}