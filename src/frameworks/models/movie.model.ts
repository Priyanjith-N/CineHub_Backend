import mongoose, { Model, Schema } from "mongoose";
import IMovie from "../../entity/movie.entity";

const movieSchema: Schema = new Schema<IMovie>({
    name: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    coverPhoto: {
        type: String,
        required: true
    },
    bannerPhoto: {
        type: String,
        required: true
    },
    trailer: {
        type: String,
        required: true,
        default: ''
    },
    duration: {
        hours: { type: Number, required: true },
        minutes: { type: Number, required: true }
    },
    releaseDate: {
        type: Date,
        required: false,
    },
    category: [
        {
            type: String,
            required: true
        }
    ],
    language: [
        {
            type: String,
            required: true
        }
    ],
    type: {
        type: String,
        required: true 
    },
    cast: [
        {
            image: { type: String, required: true },
            name: { type: String, required: true },
            role: { type: String, required: true }
        }
    ],
    crew: [
        {
            image: { type: String, required: true },
            name: { type: String, required: true },
            role: { type: String, required: true }
        }
    ],
    isTakenByDistributer: {
        type: Boolean,
        required: true,
        default: false
    },
    distributerId: {
        type: Schema.Types.ObjectId,
        required: false,
    },
    profitSharingPerTicket: {
        type: Number,
        required: true,
        default: 0
    },
    isListed: {
        type: Boolean,
        required: true,
        default: true
    }
});

const Movies: Model<IMovie> = mongoose.model<IMovie>('Movies', movieSchema);

export default Movies;