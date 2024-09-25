import { ObjectId } from "mongoose";
import IImage, { ILocation } from "../interface/common/IImage.interface";

export default interface ITheater {
    _id: string;
    name: string;
    ownerId: string | ObjectId;
    numberOfScreen: number;
    images: IImage[];
    location: ILocation;
    licence: IImage;
    isListed: boolean;
}

export interface ITheaterOwnerDashboardData {
    totalActiveMovieCount: number;
    totalOverallBooking: number;
    totalPendingRequest: number;
}