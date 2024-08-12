// interfaces
import { NextFunction, Response } from "express";
import ITheaterOwnerController, { IAddScreenCredentials, IGetMovieListOfDistributerData } from "../../interface/controllers/theaterOwner.controller";
import { AuthRequest } from "../../interface/middlewares/authMiddleware.interface";
import ITheaterOwnerUseCase from "../../interface/usecase/theaterOwner.usecase";
import { IDistributerList } from "../../entity/distributer.entity";
import { StatusCodes } from "../../enums/statusCode.enum";
import IMovie from "../../entity/movie.entity";
import ITheater from "../../entity/theater.entity";
import IScreen from "../../entity/screen.entity";

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

    async getMovieListOfDistributer(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const distributerId: string | undefined = req.params.distributerId;

            const data: IGetMovieListOfDistributerData = await this.theaterOwnerUseCase.getMovieListOfDistributer(distributerId);

            res.status(StatusCodes.Success).json({
                message: "Successfull",
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async addTheater(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const theaterOwnerId: string | undefined = req.id;

            const name: string | undefined = req.body.name;
            const images: string[] | undefined = req.body.images;
            const licence: string | undefined = req.body.licence;

            await this.theaterOwnerUseCase.addTheater(theaterOwnerId, name, images, licence);

            res.status(StatusCodes.Success).json({
                message: "Successfully Theater Added."
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllTheaters(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const theaterOwnerId: string = req.id!;

            const data: ITheater[] = await this.theaterOwnerUseCase.getAllTheaters(theaterOwnerId);

            res.status(StatusCodes.Success).json({
                message: "Successfull",
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async addScreen(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const theaterId: string | undefined = req.params.theaterId;

            const data: IAddScreenCredentials = {
                name: req.body.name,
                capacity: req.body.capacity,
                seatCategory: req.body.seatCategory,
                seatCategoryPattern: req.body.seatCategoryPattern,
                seatLayout: req.body.seatLayout,
                seatNumberPattern: req.body.seatNumberPattern
            }

            await this.theaterOwnerUseCase.addScreen(data, theaterId);

            res.status(StatusCodes.Success).json({
                message: "Successfully Screen added.",
            });
        } catch (err: any) {
            throw err;
        }
    }

    async getScreens(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const theaterId: string | undefined = req.params.theaterId;

            const data: IScreen[] = await this.theaterOwnerUseCase.getAllScreens(theaterId);

            res.status(StatusCodes.Success).json({
                message: "Successfull",
                data
            });
        } catch (err: any) {
            next(err);
        }
    }
}