import { ObjectId } from "mongoose";

export default interface IScreen {
    _id: string;
    name: string;
    capacity: number;
    seatCategory: ISeatCategory[];
    seatLayout: (ISeatLayout | null)[][];
    theaterId: string | ObjectId;
}

export interface ISeatCategory {
    category: string;
    rowNumbers: number[];
}

export interface ISeatCategoryPattern {
    category: string;
    price: number;
}

export interface ISeatLayout {
    name: string;
    category: string;
    price: number;
}

export interface ISeatPayAmountData extends ISeatCategoryPattern {
    quantity: number;
}