import { ObjectId } from "mongoose";
import IScreen, { ISeatLayout } from "./screen.entity";
import IMovie from "./movie.entity";
import ITheater from "./theater.entity";

export default interface ITickets {
    _id: string;
    userId: string | ObjectId;
    scheduleId: string | ObjectId;
    paymentIntentId: string;
    date: Date;
    time: string;
    movieId: string | ObjectId;
    theaterId: string | ObjectId;
    screenId: string | ObjectId;
    class: string[];
    paymentStatus: "Successfull" | "Failed" | "Pending" | "Refunded",
    ticketStatus: "Active" | "Canceled" | "Succeed" | "Fail",
    purchaseDetails: IPurchaseDetails[],
    totalPaidAmount:number;
    selectedSeatsIdx: ISelectedSeatsIdx[];
    seatDetails: ISeatLayout[];
}

export interface ISaveCredentionOfTickets {
    userId: string | ObjectId;
    scheduleId: string | ObjectId;
    paymentIntentId: string;
    date: Date;
    time: string;
    movieId: string | ObjectId;
    theaterId: string | ObjectId;
    screenId: string | ObjectId;
    class: string[];
    purchaseDetails: IPurchaseDetails[],
    totalPaidAmount:number;
    selectedSeatsIdx: ISelectedSeatsIdx[];
    seatDetails: ISeatLayout[];
}

export interface IPurchaseDetails {
    itemName: string;
    quantity: number;
    price: number;
}

export interface ISelectedSeatsIdx {
    rowIdx: number;
    colIdx: number;
}

export interface ITicketDetilas extends ITickets {
    movieData: IMovie;
    theaterData: ITheater;
    screenData: IScreen;
} 