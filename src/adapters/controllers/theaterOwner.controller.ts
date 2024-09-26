// interfaces
import { NextFunction, Response } from "express";
import ITheaterOwnerController, { IAddScreenCredentials, IGetMovieListOfDistributerData } from "../../interface/controllers/theaterOwner.controller";
import { AuthRequest } from "../../interface/middlewares/authMiddleware.interface";
import ITheaterOwnerUseCase from "../../interface/usecase/theaterOwner.usecase";
import { IDistributerList } from "../../entity/distributer.entity";
import { StatusCodes } from "../../enums/statusCode.enum";
import ITheater, { ITheaterOwnerDashboardData } from "../../entity/theater.entity";
import IScreen from "../../entity/screen.entity";
import { IMovieRequestCredentials, IMovieRequestDetails, IMovieReRequestCredentials } from "../../entity/movieRequest.entity";
import { ILocation } from "../../interface/common/IImage.interface";
import { ITheaterOwnerMovieDetails } from "../../entity/theaterOwnerMovieCollection.entity";
import IMovieSchedule, { IMovieScheduleWithDetails, IScheduleCredentials } from "../../entity/movieSchedule.entity";
import { IGraphData } from "../../entity/theaterOwner.entity";

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
            const location: ILocation | undefined = req.body.location;

            await this.theaterOwnerUseCase.addTheater(theaterOwnerId, name, images, licence, location);

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
            next(err);
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

    async getTheater(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const theaterId: string | undefined = req.params.theaterId;

            const data: ITheater = await this.theaterOwnerUseCase.getTheater(theaterId);

            res.status(StatusCodes.Success).json({
                message: "Successfull",
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async requestForMovie(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: IMovieRequestCredentials = {
                profitSharingPerTicket: req.body.profitSharingPerTicket,
                timePeriod: req.body.timePeriod,
                requestedMovieId: req.body.requestedMovieId,
                requestedMovieDistributerId: req.body.requestedMovieDistributerId,
                theaterOwnerId: req.id
            }

            await this.theaterOwnerUseCase.requestMovie(data);

            res.status(StatusCodes.Success).json({
                message: "Successfully Movie requested."
            });
        } catch (err: any) {
            next(err);
        }
    }

    async reRequestForMovie(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const movieRequestId: string | undefined = req.params.movieRequestId;

            const data: IMovieReRequestCredentials = {
                profitSharingPerTicket: req.body.profitSharingPerTicket,
                timePeriod: req.body.timePeriod
            }

            await this.theaterOwnerUseCase.reRequestMovie(data, movieRequestId);

            res.status(StatusCodes.Success).json({
                message: "Successfully Movie re-requested."
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllMovieRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const theaterOwnerId: string | undefined = req.id;

            const data: IMovieRequestDetails[] = await this.theaterOwnerUseCase.getAllMovieRequests(theaterOwnerId);

            res.status(StatusCodes.Success).json({
                message: "Successfull",
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllMoviesFromOwnerCollection(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const theaterOwnerId: string | undefined = req.id;

            const data: ITheaterOwnerMovieDetails[] = await this.theaterOwnerUseCase.getAllMoviesFromOwnerCollection(theaterOwnerId);
            
            res.status(StatusCodes.Success).json({
                message: "Successfull",
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async addMovieSchedule(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const credentials: IScheduleCredentials = {
                date: req.body.date,
                screenId: req.body.screenId,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                movieId: req.body.movieId
            }

            await this.theaterOwnerUseCase.addMovieSchedule(credentials);

            res.status(StatusCodes.Success).json({
                message: "Successfully Schedule added."
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllSchedulesBasedOnDate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const screenId: string = req.query.screenId as string;
            const date: string = req.query.date as string;

            const data: IMovieSchedule[] = await this.theaterOwnerUseCase.getShecdulesBasedOnDate(screenId, date);

            res.status(StatusCodes.Success).json({
                message: "Successfull",
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllMovieSchedule(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const screenId: string | undefined = req.params.screenId;

            const theaterId: string | undefined = req.params.theaterId;

            const data: IMovieScheduleWithDetails[] = await this.theaterOwnerUseCase.getAllMovieSchedule(screenId, theaterId);

            res.status(StatusCodes.Success).json({
                message: "Successfull",
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getDashboardData(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: ITheaterOwnerDashboardData = await this.theaterOwnerUseCase.getDashboardData(req.id);

            res.status(StatusCodes.Success).json({
                message: "Successfull",
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getGraphData(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter: "Daily" | "Monthly" | "Yearly" | undefined = req.query.filter as ("Daily" | "Monthly" | "Yearly" | undefined);
            
            const data: IGraphData[] = await this.theaterOwnerUseCase.getGraphData(req.id, req.params.theaterId, req.params.screenId, filter);

            res.status(StatusCodes.Success).json({
                message: "Successfull",
                data
            });
        } catch (err: any) {
            next(err);
        }
    }
}