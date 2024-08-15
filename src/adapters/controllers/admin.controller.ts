// interfaces
import { Request, Response, NextFunction } from "express";
import { IAdminController } from "../../interface/controllers/admin.controller.interface";
import { IAdminUseCase } from "../../interface/usecase/admin.usecase.interface";
import { INotVerifiedDistributers, INotVerifiedTheaterOwners } from "../../interface/repositories/admin.repository.interface";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";
import IMovie, { IMovieData } from "../../entity/movie.entity";
import { IDistributer } from "../../entity/distributer.entity";
import ITheaterOwner from "../../entity/theaterOwner.entity";
import IUser from "../../entity/user.entity";

export default class AdminController implements IAdminController {
    private adminUseCase: IAdminUseCase;

    constructor(adminUseCase: IAdminUseCase) {
        this.adminUseCase = adminUseCase;
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allUserData: IUser[] = await this.adminUseCase.getAllUsersData();

            res.status(StatusCodes.Success).json({
                message: 'Sucessfully retrived users data',
                data: allUserData
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllTheaterOwners(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allTheaterOwnerData: ITheaterOwner[] = await this.adminUseCase.getAllTheaterOwnersData();

            res.status(StatusCodes.Success).json({
                message: 'Sucessfully retrived theater owners data',
                data: allTheaterOwnerData
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllDistributers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allDistributerData: IDistributer[] = await this.adminUseCase.getAllDistributersData();

            res.status(StatusCodes.Success).json({
                message: 'Sucessfully retrived distributers data',
                data: allDistributerData
            });
        } catch (err: any) {
            next(err);
        }
    }

    async blockOrUnblockUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId: string | undefined = req.params.id;
            const isBlocked: boolean | undefined = req.body.isBlocked;

            await this.adminUseCase.blockOrUnblockUser(userId, isBlocked);

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull',
            });
        } catch (err: any) {
            next(err);
        }
    }

    async blockOrUnblockTheaterOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const theaterOwnerId: string | undefined = req.params.id;
            const isBlocked: boolean | undefined = req.body.isBlocked;

            await this.adminUseCase.blockOrUnblockTheaterOwner(theaterOwnerId, isBlocked);

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull',
            });
        } catch (err: any) {
            next(err);
        }
    }

    async blockOrUnblockDistributer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const distributerId: string | undefined = req.params.id;
            const isBlocked: boolean | undefined = req.body.isBlocked;

            await this.adminUseCase.blockOrUnblockDistributer(distributerId, isBlocked);

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull',
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllDocumentVerificationRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: (INotVerifiedDistributers | INotVerifiedTheaterOwners)[] = await this.adminUseCase.getAllDocumentVerificationRequest();

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull',
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async changeDocumentVerificationStatusTheaterOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: string | undefined = req.params.id;
            const status: string | undefined = req.body.status;
            const message: string | undefined = req.body.message;

            await this.adminUseCase.changeDocumentVerificationStatusTheaterOwner(id, status, message);

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull'
            });
        } catch (err: any) {
            next(err)
        }
    }

    async changeDocumentVerificationStatusDistributer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: string | undefined = req.params.id;
            const status: string | undefined = req.body.status;
            const message: string | undefined = req.body.message;

            await this.adminUseCase.changeDocumentVerificationStatusDistributer(id, status, message);

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull'
            });
        } catch (err: any) {
            next(err)
        }
    }

    async getTheaterOwnerData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: string | undefined = req.params.id;

            const data: INotVerifiedTheaterOwners = await this.adminUseCase.getTheaterOwner(id);

            console.log(data);
            

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull',
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getDistributerData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: string | undefined = req.params.id;

            const data: INotVerifiedDistributers = await this.adminUseCase.getDistributer(id);

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull',
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async addMovieRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const movieData: IMovieData = {
                name: req.body.name,
                about: req.body.about,
                language: req.body.language,
                duration: req.body.duration,
                coverPhoto: req.body.coverPhoto,
                bannerPhoto: req.body.bannerPhoto,
                trailer: req.body.trailer,
                category: req.body.category,
                type: req.body.type,
                cast: req.body.cast,
                crew: req.body.crew,
            }
            

            // use case for adding movie to list
            await this.adminUseCase.addMovie(movieData);

            res.status(StatusCodes.Success).json({
                message: "Movie Added"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getMovie(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const movieId: string | undefined = req.params.movieId;

            const data: IMovie = await this.adminUseCase.getMovie(movieId);

            res.status(StatusCodes.Success).json({
                message: "Successfull",
                data
            });
        } catch (err: any) {
            throw err;
        }
    }

    async getAllMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const movies: IMovie[] = await this.adminUseCase.getAllMovies();

            res.status(StatusCodes.Success).json({
                message: "Successfull",
                data: movies
            });
        } catch (err: any) {
           next(err); 
        }
    }

    async listOrUnlistMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: string | undefined = req.params.id;
            const status: boolean | undefined = req.body.isListed;

            await this.adminUseCase.listOrUnlistMovies(id, status);

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull',
            });
        } catch (err: any) {
            next(err);
        }
    }

    async updateMovie(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const movieId: string | undefined = req.params.movieId;
            
            const movieData: IMovieData = {
                name: req.body.name,
                about: req.body.about,
                language: req.body.language,
                duration: req.body.duration,
                coverPhoto: req.body.coverPhoto,
                bannerPhoto: req.body.bannerPhoto,
                trailer: req.body.trailer,
                category: req.body.category,
                type: req.body.type,
                cast: req.body.cast,
                crew: req.body.crew,
            }
            
            await this.adminUseCase.editMovie(movieData, movieId);

            res.status(StatusCodes.Success).json({
                message: "Movie Edited"
            });
        } catch (err: any) {
            next(err);
        }
    }
}