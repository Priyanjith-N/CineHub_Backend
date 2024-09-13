import mongoose, { Model, Schema } from "mongoose";
import IMovieStreaming from "../../entity/movieStreaming.entity";

const movieStreamingSchema: Schema = new Schema<IMovieStreaming>({
    buyAmount: {
        type: Number,
        required: true
    },
    movieId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    rentalPeriod: {
        type: Number, 
        required: true
    },
    rentAmount: {
        type: Number,
        required: true
    }
});

const MovieStreaming: Model<IMovieStreaming> = mongoose.model<IMovieStreaming>('MovieStreaming', movieStreamingSchema);

export default MovieStreaming;