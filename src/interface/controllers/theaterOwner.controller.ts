import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.interface";
import { IDistributerList } from "../../entity/distributer.entity";
import IMovie from "../../entity/movie.entity";
import IImage, { ILocation } from "../common/IImage.interface";

export default interface ITheaterOwnerController {
    getDistributerList(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMovieListOfDistributer(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    addTheater(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllTheaters(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    addScreen(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getScreens(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTheater(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    requestForMovie(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllMovieRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllMoviesFromOwnerCollection(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    addMovieSchedule(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllSchedulesBasedOnDate(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}

export interface IGetMovieListOfDistributerData {
    distributer: IDistributerList,
    movieList: IMovie[];
}

export interface IAddTheaterCredentials {
    name: string;
    theaterOwnerId: string;
    images: (string | IImage)[];
    licence: string | IImage;
    location: ILocation;
}

export interface IAddScreenCredentials {
    name: string | undefined;
    capacity: number | undefined;
    seatCategory: { category: string, price: number }[] | undefined;
    seatLayout: boolean[][] | undefined;
    seatNumberPattern: {
        pattern: "Alphanumerical" | undefined;
        startFrom: "left" | "right" | undefined
    } | undefined,
    seatCategoryPattern: ({ category: string, price: number } | undefined | null)[] | undefined;
}