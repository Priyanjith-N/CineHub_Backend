import { ObjectId } from "mongoose";

export interface IPayload {
    id: ObjectId,
    type: string
}

export default interface IJWTService {
    sign(payload: IPayload): string;
    verifyToken(token: string): IPayload;
}