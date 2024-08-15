// interfaces
import { IDistributer } from "../../entity/distributer.entity";
import IMovie, { IMovieData } from "../../entity/movie.entity";
import ITheaterOwner from "../../entity/theaterOwner.entity";
import IUser from "../../entity/user.entity";

export interface IAdminRepository {
    allUser(): Promise<IUser[] | never>;
    allTheaterOwners(): Promise<ITheaterOwner[] | never>;
    allDistributers(): Promise<IDistributer[] | never>;
    updateUserIsBlockedStatus(id: string, isBlocked: boolean): Promise<void | null>;
    updateTheaterOwnerIsBlockedStatus(id: string, isBlocked: boolean): Promise<void | null>;
    updateDistributerIsBlockedStatus(id: string, isBlocked: boolean): Promise<void | null>;
    getAllDocumentVerificationPendingData(): Promise<(INotVerifiedDistributers | INotVerifiedTheaterOwners)[]>;
    changeDocumentVerificationStatusTheaterOwner(id: string, status: string): Promise<string | undefined | never>;
    changeDocumentVerificationStatusDistributer(id: string, status: string): Promise<string | undefined | never>;
    getTheaterOwner(id: string): Promise<INotVerifiedTheaterOwners | undefined | never>
    getDistributer(id: string): Promise<INotVerifiedDistributers | undefined | never>;
    getMovieByName(name: string): Promise<IMovie | null | never>;
    saveMovie(movieData: IMovieData): Promise<void | never>;
    getMovie(movieId: string): Promise<IMovie | null | never>;
    getAllMovies(): Promise<IMovie[] | never>;
    makeMovieAsListedOrUnlisted(id: string, status: boolean): Promise<void | never>;
}

export interface INotVerifiedTheaterOwners {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    idProof: string;
    idProofImage: string[];
    OTPVerificationStatus: boolean;
    documentVerificationStatus: string;
    idProofUpdateVerificationStatus: boolean;
    idProofUpdateDocumentImage: string[] | null | undefined;
    isBlocked: boolean;
    role: string;
}

export interface INotVerifiedDistributers {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    licence: string;
    idProof: string;
    idProofImage: string[];
    OTPVerificationStatus: boolean;
    documentVerificationStatus: string;
    licenceUpdateDocument: string | undefined | null;
    licenceUpdateVerificationStatus: boolean;
    idProofUpdateVerificationStatus: boolean;
    idProofUpdateDocumentImage: string[] | undefined | null;
    isBlocked: boolean;
    role: string;
}