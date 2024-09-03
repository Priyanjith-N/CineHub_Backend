import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.interface";

export default interface IUserController {
    getDataForHomePage(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMovieDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllShowsForAMovie(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}