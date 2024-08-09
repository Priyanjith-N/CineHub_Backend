import { NextFunction, Request, Response } from "express";

// interfaces
import { AuthRequest } from "../middlewares/authMiddleware.interface";

export default interface IDistributerController {
    getAllAvailableMovies(req: Request, res: Response, next: NextFunction): Promise<void>;
    distributeMovie(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}