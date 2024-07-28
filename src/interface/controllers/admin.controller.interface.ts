import { NextFunction, Request, Response } from "express";

export interface IAdminController {
    getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllTheaterOwners(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllDistributers(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockOrUnblockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockOrUnblockTheaterOwner(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockOrUnblockDistributer(req: Request, res: Response, next: NextFunction): Promise<void>;
}