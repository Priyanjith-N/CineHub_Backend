import { NextFunction, Request, Response } from "express";

// interfaces
import IDistributerController from "../../interface/controllers/distributer.controller.interface";
import IDistributerUseCase from "../../interface/usecase/distributer.usecase.interface";
import IMovie from "../../entity/movie.entity";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";
import { AuthRequest } from "../../interface/middlewares/authMiddleware.interface";

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
}