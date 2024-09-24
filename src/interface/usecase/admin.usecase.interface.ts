// interfaces
import { IDashboardDatas } from "../../entity/admin.entity";
import { IDistributer } from "../../entity/distributer.entity";
import IMovie, { IDataMovies, IMovieData } from "../../entity/movie.entity";
import ITheaterOwner from "../../entity/theaterOwner.entity";
import IUser from "../../entity/user.entity";
import { INotVerifiedDistributers, INotVerifiedTheaterOwners } from "../repositories/admin.repository.interface";

export interface IAdminUseCase {
    getAllUsersData(): Promise<IUser[] | never>;
    getAllTheaterOwnersData(): Promise<ITheaterOwner[] | never>;
    getAllDistributersData(): Promise<IDistributer[] | never>;
    blockOrUnblockUser(id: string | undefined, isBlocked: boolean | undefined): Promise<void | never>;
    blockOrUnblockTheaterOwner(id: string | undefined, isBlocked: boolean | undefined): Promise<void | never>;
    blockOrUnblockDistributer(id: string | undefined, isBlocked: boolean | undefined): Promise<void | never>;
    getAllDocumentVerificationRequest(): Promise<(INotVerifiedDistributers | INotVerifiedTheaterOwners)[]>;
    changeDocumentVerificationStatusTheaterOwner(id: string | undefined, status: string | undefined,  message: string | undefined): Promise<void | never>;
    changeDocumentVerificationStatusDistributer(id: string | undefined, status: string | undefined,  message: string | undefined): Promise<void | never>;
    getTheaterOwner(id: string | undefined): Promise<INotVerifiedTheaterOwners | never>;
    getDistributer(id: string | undefined): Promise<INotVerifiedDistributers | never>;
    addMovie(movieData: IMovieData): Promise<void | never>;
    getMovie(movieId: string | undefined): Promise<IMovie | never>;
    getAllMovies(page: number, isListed: boolean, limit: number): Promise<IDataMovies | never>;
    listOrUnlistMovies(id: string | undefined, status: boolean | undefined): Promise<void | never>;
    editMovie(movieData: IMovieData, movieId: string | undefined): Promise<void | never>;
    getDataForDashBoard(): Promise<IDashboardDatas | never>;
}