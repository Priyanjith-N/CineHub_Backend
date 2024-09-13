import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.interface";

export default interface IUserController {
    getDataForHomePage(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getMovieDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllShowsForAMovie(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTheaterScreenLayout(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    createCheckoutSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    bookSeat(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllActiveTickets(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    cancelTicket(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAllTransactionList(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}