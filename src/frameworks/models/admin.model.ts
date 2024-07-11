import mongoose, { Schema } from "mongoose";

// interfaces
import { IAdminDocument, IAdminCollection } from "../../interface/collections/IAdmin.collections";

const adminsSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const Admins: IAdminCollection = mongoose.model<IAdminDocument>('Admins', adminsSchema);

export default Admins;