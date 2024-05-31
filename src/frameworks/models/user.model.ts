import mongoose, { Schema } from "mongoose";
import { IUser, IUsersCollection } from "../../interface/collections/IUsers.collections";

const usersSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    OTPVerification: {
        type: Boolean,
        required: true,
        default: false
    }
});



const Users: IUsersCollection = mongoose.model<IUser>('Users', usersSchema);

export default Users;