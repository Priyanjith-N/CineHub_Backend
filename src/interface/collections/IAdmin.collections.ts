import { Document, Model, ObjectId } from "mongoose";

export interface IAdminDocument extends Document {
    _id: ObjectId;
    email: String;
    password: String;
}


export interface IAdminCollection extends Model<IAdminDocument> {}