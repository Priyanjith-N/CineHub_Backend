import { Schema } from "mongoose";

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