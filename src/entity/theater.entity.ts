import { ObjectId } from "mongoose";
import IImage from "../interface/common/IImage.interface";

export default interface ITheater {
    _id: string;
    name: string;
    ownerId: string | ObjectId;
    numberOfScreen: number;
    images: IImage[];
    licence: IImage;
    isListed: boolean;
}