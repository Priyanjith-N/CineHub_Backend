export default interface IMovie {
    _id: string;
    name: string;
    about: string;
    language: string[];
    duration: IDuration;
    releaseDate: Date | undefined;
    coverPhoto: string;
    bannerPhoto: string;
    trailer: string;
    category: string[];
    type: "2D" | "3D" | string;
    cast: IMovieWorkerDetails[];
    crew: IMovieWorkerDetails[];
    isTakenByDistributer: boolean;
    distributerId: string;
}

export interface IMovieData {
    name: string | undefined;
    about: string | undefined;
    language: string[] | undefined;
    duration: IDuration | undefined;
    coverPhoto: string | undefined;
    bannerPhoto: string | undefined;
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
    image: string;
    name: string;
    role: string;
}