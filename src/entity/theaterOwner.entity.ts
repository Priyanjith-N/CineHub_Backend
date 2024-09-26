import IImage from "../interface/common/IImage.interface";
import ITheater from "./theater.entity";

export default interface ITheaterOwner {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    idProof: string;
    idProofImage: IImage[];
    OTPVerificationStatus: boolean;
    documentVerificationStatus: string;
    isBlocked: boolean;
}

export interface IAllTheaterWithScreen {
    theaterData: ITheater;
    screens: {
        _id: string;
        name: string;
    }[]
}

export interface IGroupPipline<Filter> {
    $group: {
        _id: Filter  
        revenue: {
        $sum: '$totalPaidAmount'
        }
    }
}

export interface IDay {
    $dayOfMonth: string;
}

export interface IMonth {
    $dateToString: {
        format: string; 
        date: string;
    }
}

export interface IYear {
    $year: string;
}

export interface IDaily {
    day: IDay;
    month: IMonth, 
    year: IYear;
}

export interface IMonthly {
    month: IMonth, 
    year: IYear;
}

export interface IYearly {
    year: IYear;
}

export interface IGraphData {
    revenue: number;
    day?: number;
    month?: string;
    year: number;
}