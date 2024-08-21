import mongoose, { Model, Schema } from "mongoose";

// interfaces
import ITheaterOwnerMovieCollection from "../../entity/theaterOwnerMovieCollection.entity";

const theaterOwnerMovieCollectionSchema: Schema = new Schema<ITheaterOwnerMovieCollection>({
    profitSharingPerTicket: {
        type: Number,
        required: true
    },
    timePeriod: {
        type: Number,
        required: true
    },
    movieId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    movieDistributerId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    theaterOwnerId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    movieValidity: {
        type: Date,
        required: true
    }
});

const TheaterOwnerMovieCollections: Model<ITheaterOwnerMovieCollection> = mongoose.model<ITheaterOwnerMovieCollection>('TheaterOwnerMovieCollections', theaterOwnerMovieCollectionSchema);

export default TheaterOwnerMovieCollections;