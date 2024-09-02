import IImage from "../interface/common/IImage.interface";

export default interface IMovie {
    _id: string;
    name: string;
    about: string;
    language: string[];
    duration: IDuration;
    releaseDate: Date | undefined;
    coverPhoto: IImage;
    bannerPhoto: IImage;
    trailer: string;
    category: string[];
    type: "2D" | "3D" | string;
    cast: IMovieWorkerDetails[];
    crew: IMovieWorkerDetails[];
    isTakenByDistributer: boolean;
    distributerId?: string;
    profitSharingPerTicket: number;
    isListed: boolean;
}

export interface IMovieData {
    name: string | undefined;
    about: string | undefined;
    language: string[] | undefined;
    duration: IDuration | undefined;
    coverPhoto: string | IImage | undefined;
    bannerPhoto: string | IImage | undefined;
    trailer: string | undefined;
    category: string[] | undefined;
    type: "2D" | "3D" | string | undefined;
    cast: IMovieWorkerDetails[] | undefined;
    crew: IMovieWorkerDetails[] | undefined;
}

interface IDuration {
    hours: number;
    minutes: number;
}

interface IMovieWorkerDetails {
    image: IImage | string;
    name: string;
    role: string;
}

export interface IDataMovies {
    movies: IMovie[];
    totalMovieCount: number;
}

export interface INowPlayingMovies {
    movieData: IMovie;
}