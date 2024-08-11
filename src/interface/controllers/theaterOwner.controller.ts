import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.interface";
import { IDistributerList } from "../../entity/distributer.entity";
import IMovie from "../../entity/movie.entity";

export default interface ITheaterOwnerController {
    getDistributerList(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMovieListOfDistributer(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}

export interface IGetMovieListOfDistributerData {
    distributer: IDistributerList,
    movieList: IMovie[];
}