import mongoose, { Model, Schema, Types } from "mongoose";
import IMovieSchedule from "../../entity/movieSchedule.entity";

const movieSchedule: Schema = new Schema<IMovieSchedule>({
    date: {
        type: Date,
        required: true
    },
    screenId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    movieId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    seats: [
        [
            {
                name: { type: String },
                category: { type: String },
                price: { type: Number },
                isBooked: { type: Boolean, default: false },
                bookedUserId: { type: Schema.Types.ObjectId, required: false, default: null }
            }
        ]
    ],
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    }
});

const MovieSchedules: Model<IMovieSchedule> = mongoose.model<IMovieSchedule>('MovieSchedules', movieSchedule);

export default MovieSchedules;