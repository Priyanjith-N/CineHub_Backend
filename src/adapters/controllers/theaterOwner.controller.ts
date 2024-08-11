// interfaces
import { NextFunction, Response } from "express";
import ITheaterOwnerController from "../../interface/controllers/theaterOwner.controller";
import { AuthRequest } from "../../interface/middlewares/authMiddleware.interface";
import ITheaterOwnerUseCase from "../../interface/usecase/theaterOwner.usecase";
import { IDistributerList } from "../../entity/distributer.entity";
import { StatusCodes } from "../../enums/statusCode.enum";

export default class TheaterOwnerController implements ITheaterOwnerController {
    private theaterOwnerUseCase: ITheaterOwnerUseCase;

    constructor(theaterOwnerUseCase: ITheaterOwnerUseCase) {
        this.theaterOwnerUseCase = theaterOwnerUseCase;
    }

    async getDistributerList(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: IDistributerList[] = await this.theaterOwnerUseCase.getDistributerList();
            
            res.status(StatusCodes.Success).json({
                message: "Successfull",
                data
            });
        } catch (err: any) {
            next(err);
        }
    }
}