import { ObjectId } from "mongoose";

export default interface IScreen {
    _id: string;
    name: string;
    capacity: number;
    seatCategory: ISeatCategory[];
    seatLayout: (ISeatCategory | null)[];
    theaterId: string | ObjectId;
}

export interface ISeatCategory {
    category: string;
    price: number;
}

export interface ISeatLayout {
    name: string;
    category: string;
    price: number;
}