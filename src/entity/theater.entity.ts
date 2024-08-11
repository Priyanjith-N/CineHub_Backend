import { ObjectId } from "mongoose";

export default interface ITheater {
    _id: string;
    name: string;
    ownerId: string | ObjectId;
    numberOfScreen: number;
    images: string[];
    licence: string;
    isListed: boolean;
}