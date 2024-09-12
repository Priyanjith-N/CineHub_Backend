import mongoose, { Model, Schema } from "mongoose";
import ITickets from "../../entity/tickets.entity";

const ticketSchema: Schema = new Schema<ITickets>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    scheduleId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    paymentIntentId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    movieId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    theaterId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    screenId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    class: [
        {
            type: String,
            required: true
        }
    ],
    paymentStatus: {
        type: String,
        enum: ["Successfull", "Failed", "Pending"],
        default: "Successfull",
        required: true
    },
    ticketStatus: {
        type: String,
        enum: ["Active", "Canceled", "Succeed", "Fail"],
        default: "Active",
        required: true
    },
    purchaseDetails: [
        {
            itemName: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalPaidAmount:{
        type: Number,
        required: true
    },
    selectedSeatsIdx: [
        {
            rowIdx: {
                type: Number,
                required: true
            },
            colIdx: {
                type: Number,
                required: true
            }
        }
    ],
    seatDetails: [
        {
            name: {
                type: String,
                required: true
            },
            category: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ]
});

const Tickets: Model<ITickets> = mongoose.model<ITickets>('Tickets', ticketSchema);

export default Tickets;