import mongoose, { Model, Schema } from "mongoose";
import ITheater from "../../entity/theater.entity";

const theaterSchema: Schema = new Schema<ITheater>({
    name: {
        type: String,
        required: true
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    numberOfScreen: {
        type: Number,
        default: 0,
        required: true
    },
    licence: {
        type: String,
        required: true
    },
    isListed: {
        type: Boolean,
        required: true,
        default: true
    }
});

const Theaters: Model<ITheater> = mongoose.model<ITheater>('Theaters', theaterSchema);

export default Theaters;