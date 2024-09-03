import { NextFunction, Response } from "express";
import IUserController from "../../interface/controllers/user.controller.interface";
import { AuthRequest } from "../../interface/middlewares/authMiddleware.interface";
import IUserUseCase, { IHomeMovieData } from "../../interface/usecase/user.usercase";
import { StatusCodes } from "../../enums/statusCode.enum";
import IMovie from "../../entity/movie.entity";
import { IMovieSchedulesForBooking, IMovieSchedulesWithTheaterDetails } from "../../entity/movieSchedule.entity";

export default class UserController implements IUserController {
    private userUseCase: IUserUseCase;

    constructor(userUseCase: IUserUseCase) {
      this.userUseCase = userUseCase;
    }

    async getDataForHomePage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const data: IHomeMovieData = await this.userUseCase.getAllDataForHomePage();
        
        res.status(StatusCodes.Success).json({
          message: "Sucessfull",
          data
        });
      } catch (err: any) {
          next(err);
      }
    }

    async getMovieDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const movieId: string | undefined = req.params.movieId;
        const data: IMovie = await this.userUseCase.getMovieDetails(movieId);

        res.status(StatusCodes.Success).json({
          message: "Sucessfull",
          data
        });
      } catch (err: any) {
        next(err);
      }
    }

    async getAllShowsForAMovie(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const movieId: string | undefined = req.params.movieId;

        const data: IMovieSchedulesWithTheaterDetails[] = await this.userUseCase.getAllShowsForAMovie(movieId);

        res.status(StatusCodes.Success).json({
          message: "Sucessfull",
          data
        });
      } catch (err: any) {
        next(err);
      }
    }

    async getTheaterScreenLayout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const scheduleId: string | undefined = req.params.scheduleId;

        const data: IMovieSchedulesForBooking = await this.userUseCase.getTheaterScreenLayout(scheduleId);

        res.status(StatusCodes.Success).json({
          message: "Sucessfull",
          data
        });
      } catch (err: any) {
        next(err);
      }
    }
}