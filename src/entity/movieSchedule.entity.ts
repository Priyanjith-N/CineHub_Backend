import { Schema } from "mongoose";
import { ISeatLayout } from "./screen.entity";
import ITheater from "./theater.entity";

export default interface IMovieSchedule {
    _id: string | Schema.Types.ObjectId;
    date: Date;
    screenId: string | Schema.Types.ObjectId;
    startTime: string;
    endTime: string;
    movieId: string | Schema.Types.ObjectId;
    seats: (IScheduleSeatLayout | null)[][];
    availableSeats: number;
}

export interface IScheduleSeatLayout extends ISeatLayout {
    bookedUserId: string | Schema.Types.ObjectId | null;
    isBooked: boolean;
}

export interface IScheduleCredentials {
    screenId: string | undefined;
    date: Date | undefined;
    startTime: string | undefined;  
    endTime: string | undefined;
    movieId: string | undefined;
}

export interface ISchedulesForMovie {
    scheduleId: string;
    startTime: string;
    endTime: string;
    availableSeats: number;
}

export interface IMovieSchedulesWithTheaterDetails {
    scheduledDate: Date;
    theaterData: ITheater;
    schedules: ISchedulesForMovie[];
}
