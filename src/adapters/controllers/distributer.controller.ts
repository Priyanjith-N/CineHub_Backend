import { NextFunction, Request, Response } from "express";

// interfaces
import IDistributerController from "../../interface/controllers/distributer.controller.interface";
import IDistributerUseCase from "../../interface/usecase/distributer.usecase.interface";
import IMovie from "../../entity/movie.entity";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";
import { AuthRequest } from "../../interface/middlewares/authMiddleware.interface";
import { IMovieRequestDetailsForDistributer } from "../../entity/movieRequest.entity";
import { IMovieStreamingCredentials, IMovieStreamingDetails } from "../../entity/movieStreaming.entity";

export default class DistributerController implements IDistributerController {
    private distributerUseCase: IDistributerUseCase;

    constructor(distributerUseCase: IDistributerUseCase) {
        this.distributerUseCase = distributerUseCase;
    }

    async getAllAvailableMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: IMovie[] = await this.distributerUseCase.getAllAvailableMovies();

            res.status(StatusCodes.Success).json({
                message: 'Successfull',
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async distributeMovie(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: string | undefined = req.id;
            const movieId: string | undefined = req.params.id;
            const releaseDate: Date | undefined = req.body.releaseDate;
            const profitSharingPerTicket: number | undefined = req.body.profitSharingPerTicket;

            await this.distributerUseCase.distributeMovie(id, movieId, releaseDate, profitSharingPerTicket);

            res.status(StatusCodes.Success).json({
                message: 'Successfully movie Distibuted'
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getMyMovies(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const distributerId: string | undefined = req.id;

            const data: IMovie[] = await this.distributerUseCase.getDistributedMovies(distributerId);

            res.status(StatusCodes.Success).json({
                message: "Successfull",
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async editProfitSharingOfDistributedMovie(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const distributerId: string | undefined = req.id;
            const movieId: string | undefined = req.params.id;
            const releaseDate: Date | undefined = req.body.releaseDate;
            const profitSharingPerTicket: number | undefined = req.body.profitSharingPerTicket;

            await this.distributerUseCase.editProfitSharingOfDistributedMovie(distributerId, movieId, releaseDate, profitSharingPerTicket);

            res.status(StatusCodes.Success).json({
                message: 'Successfully updated.'
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllMovieRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const distributerId: string | undefined = req.id;

            const data: IMovieRequestDetailsForDistributer[] = await this.distributerUseCase.getAllMovieRequests(distributerId);

            res.status(StatusCodes.Success).json({
                message: 'Successfull',
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async approveMovieRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const requestId: string | undefined = req.params.requestId;
            const theaterOwnerEmail: string | undefined = req.body.theaterOwnerEmail; 
            const movieName: string | undefined = req.body.movieName;

            await this.distributerUseCase.approveMovieRequest(requestId, theaterOwnerEmail, movieName);

            res.status(StatusCodes.Success).json({
                message: 'Request Approved'
            });
        } catch (err: any) {
            next(err);
        }
    }

    async rejectMovieRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const requestId: string | undefined = req.params.requestId; 
            const theaterOwnerEmail: string | undefined = req.body.theaterOwnerEmail; 
            const movieName: string | undefined = req.body.movieName;
            const reason: string | undefined = req.body.reason; 

            await this.distributerUseCase.rejectMovieRequest(requestId, theaterOwnerEmail, movieName, reason);

            res.status(StatusCodes.Success).json({
                message: 'Request Rejected'
            });
        } catch (err: any) {
            next(err);
        }
    }

    async addStreaming(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const addStreamingCredentials: IMovieStreamingCredentials = {
                movieId: req.body.movieId,
                buyAmount: req.body.buyAmount,
                rentalPeriod: req.body.rentalPeriod,
                rentAmount: req.body.rentAmount
            }

            await this.distributerUseCase.addStreaming(addStreamingCredentials);

            res.status(StatusCodes.Success).json({
                message: 'Movie Now Streaming.'
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllStreamingMovieDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: IMovieStreamingDetails[] = await this.distributerUseCase.getAllStreamingMovieDetails(req.id);

            res.status(StatusCodes.Success).json({
                message: 'Successfull',
                data
            });
        } catch (err: any) {
            next(err);
        }
    }
}