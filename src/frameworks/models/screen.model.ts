import mongoose, { Model, Schema } from "mongoose";
import IScreen from "../../entity/screen.entity";

const screenSchema: Schema = new Schema<IScreen>({
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    seatCategory: [
        {
            category: { type: String, required: true },
            rowNumbers: { type: [Number], required: true }
        }
    ],
    seatLayout: [
        [
            {
                name: { type: String },
                category: { type: String },
                price: { type: Number }
            }
        ]
    ],
    theaterId: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

const Screens: Model<IScreen> = mongoose.model<IScreen>('Screens', screenSchema);

export default Screens;