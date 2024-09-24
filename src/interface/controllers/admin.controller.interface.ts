import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.interface";

export interface IAdminController {
    getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllTheaterOwners(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllDistributers(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockOrUnblockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockOrUnblockTheaterOwner(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockOrUnblockDistributer(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllDocumentVerificationRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    changeDocumentVerificationStatusTheaterOwner(req: Request, res: Response, next: NextFunction): Promise<void>;
    changeDocumentVerificationStatusDistributer(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTheaterOwnerData(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDistributerData(req: Request, res: Response, next: NextFunction): Promise<void>;
    addMovieRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMovie(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllMovies(req: Request, res: Response, next: NextFunction): Promise<void>;
    listOrUnlistMovies(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateMovie(req: Request, res: Response, next: NextFunction): Promise<void>;
    getDashboardData(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}