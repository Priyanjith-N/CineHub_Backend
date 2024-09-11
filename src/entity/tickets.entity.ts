import { ObjectId } from "mongoose";
import { ISeatLayout } from "./screen.entity";

export default interface ITickets {
    userId: string | ObjectId;
    scheduleId: string | ObjectId;
    paymentIntentId: string;
    date: Date;
    time: string;
    movieId: string | ObjectId;
    theaterId: string | ObjectId;
    screenId: string | ObjectId;
    class: string[];
    paymentStatus: "Successfull" | "Failed" | "Pending",
    ticketStatus: "Active" | "canceled" | "Succeed" | "Fail",
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