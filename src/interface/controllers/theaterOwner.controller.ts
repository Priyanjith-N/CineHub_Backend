import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.interface";

export default interface ITheaterOwnerController {
    getDistributerList(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}