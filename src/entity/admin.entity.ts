import { IDistributer } from "./distributer.entity";
import IMovie from "./movie.entity";
import ITheater from "./theater.entity";

export default interface IAdmin {
    _id: string;
    email: String;
    password: String;
}

export interface ITop10Movies {
    totalTicketSold: number;
    amount: number;
    movieData: IMovie;
}

export interface ITop10Theaters {
    amount: number;
    theaterData: ITheater;
}

export interface ITop10Distributers {
    amount: number;
    distributerData: IDistributer;
}

export interface IDashboardDatas {
    totalTheatersCount: number;
    totalDistributersCount: number;
    totalMoviesCount: number;
    top10Movies: ITop10Movies[];
    top10Distributers: ITop10Distributers[];
    top10Theaters: ITop10Theaters[];
}