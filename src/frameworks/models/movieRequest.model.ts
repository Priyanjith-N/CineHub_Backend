import mongoose, { Model, Schema } from "mongoose";

// interfaces
import IMovieRequest from "../../entity/movieRequest.entity";

const movieRequestSchema: Schema = new Schema<IMovieRequest>({
    profitSharingPerTicket: {
        type: Number,
        required: true
    },
    timePeriod: {
        type: Number,
        required: true
    },
    requestedMovieDistributerId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    requestedMovieId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    theaterOwnerId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    requestStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const MovieRequests: Model<IMovieRequest> = mongoose.model<IMovieRequest>('MovieRequestes', movieRequestSchema);

export default MovieRequests;