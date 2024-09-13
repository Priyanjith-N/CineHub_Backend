import { NextFunction, Response } from "express";
import IUserController from "../../interface/controllers/user.controller.interface";
import { AuthRequest } from "../../interface/middlewares/authMiddleware.interface";
import IUserUseCase, { IHomeMovieData } from "../../interface/usecase/user.usercase";
import { StatusCodes } from "../../enums/statusCode.enum";
import IMovie from "../../entity/movie.entity";
import { IMovieSchedulesForBooking, IMovieSchedulesWithTheaterDetails } from "../../entity/movieSchedule.entity";
import { IBookSeatCredentials, ICreateCheckoutSessionCredentials } from "../../entity/user.entity";
import { ITicketDetilas } from "../../entity/tickets.entity";

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

    async createCheckoutSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const data: ICreateCheckoutSessionCredentials = {
          scheduleId: req.body.scheduleId,
          selectedSeats: req.body.selectedSeats
        }

        const sessionId: string = await this.userUseCase.createCheckoutSession(data);

        req.app.locals.bookingSeatCredentials = {
          scheduleId: req.body.scheduleId,
          selectedSeats: req.body.selectedSeats,
          sessionId,
          userId: req.id
        }

        res.status(StatusCodes.Success).json({
          message: "Sucessfull",
          sessionId
        });
      } catch (err: any) {
        next(err);
      }
    }

    async bookSeat(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const seatBookingCredentials: IBookSeatCredentials | undefined = req.app.locals.bookingSeatCredentials;

        await this.userUseCase.bookSeat(seatBookingCredentials, req.id, req.body.checkoutSessionId);

        delete req.app.locals.bookingSeatCredentials;

        res.status(StatusCodes.Success).json({
          message: "Sucessfull"
        });
      } catch (err: any) {
        delete req.app.locals.bookingSeatCredentials
        next(err);
      }
    }

    async getAllActiveTickets(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const data: ITicketDetilas[] = await this.userUseCase.getAllActiveTickets(req.id);

        res.status(StatusCodes.Success).json({
          message: "Sucessfull",
          data
        });        
      } catch (err: any) {
        next(err);
      }
    }

    async cancelTicket(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const ticketId: string | undefined = req.params.ticketId;

        await this.userUseCase.cancelTicket(ticketId, req.id);

        res.status(StatusCodes.Success).json({
          message: "Sucessfully amount Refunded",
        });
      } catch (err: any) {
        next(err);
      }
    }

    async getAllTransactionList(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const data: ITicketDetilas[] = await this.userUseCase.getAllTransactionList(req.id);

        res.status(StatusCodes.Success).json({
          message: "Sucessfull",
          data
        }); 
      } catch (err: any) {
        next(err);
      }
    }

    async getTicketDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const data: ITicketDetilas = await this.userUseCase.getTicketDetails(req.params.ticketId, req.id);

        res.status(StatusCodes.Success).json({
          message: "Sucessfull",
          data
        });
      } catch (err: any) {
        next(err);
      }
    }
}