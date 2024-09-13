import { NextFunction, Request, Response } from "express";

// interfaces
import { AuthRequest } from "../middlewares/authMiddleware.interface";

export default interface IDistributerController {
    getAllAvailableMovies(req: Request, res: Response, next: NextFunction): Promise<void>;
    distributeMovie(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMyMovies(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    editProfitSharingOfDistributedMovie(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllMovieRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    approveMovieRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    rejectMovieRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    addStreaming(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllStreamingMovieDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}