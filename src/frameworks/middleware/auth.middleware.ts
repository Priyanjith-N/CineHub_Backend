import { NextFunction, Response } from "express";

// collections
import Admins from "../models/admin.model";
import Distributers from "../models/distributer.model";
import TheaterOwners from "../models/theaterOwner.model";
import Users from "../models/user.model";

// interfaces
import IAuthMiddleware, { AuthRequest } from "../../interface/middlewares/authMiddleware.interface";
import IJWTService, { IPayload } from "../../interface/utils/IJWTService";
import { IAdminDocument } from "../../interface/collections/IAdmin.collections";
import { IDistributerDocument } from "../../interface/collections/IDistributer.collection";
import { ITheaterOwnerDocument } from "../../interface/collections/ITheaterOwner.collection";
import { IUserDocument } from "../../interface/collections/IUsers.collections";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";

// errors
import JWTTokenError from "../../errors/jwt.error";
import AuthenticationError from "../../errors/authentication.error";
import { isObjectIdOrHexString } from "mongoose";

export default class AuthMiddleware implements IAuthMiddleware {
    private type: "Admin" | "Distributer" | "TheaterOwner" | "User";
    private jwtService: IJWTService;

    constructor(type: "Admin" | "Distributer" | "TheaterOwner" | "User", jwtService: IJWTService) {
        this.type = type;
        this.jwtService = jwtService;
    }

    async isAuthenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const token: string | undefined = req.cookies.token;

            if(!token) {
                throw new JWTTokenError({ message: "NOT AUTHENTICATED", statusCode: StatusCodes.Unauthorized });
            }

            const decoded: IPayload = this.jwtService.verifyToken(token);

            if(decoded.type !== this.type || !isObjectIdOrHexString(decoded.id)) {
                throw new JWTTokenError({ statusCode: StatusCodes.BadRequest, message: 'Invaild Token' });
            }

            let data: IAdminDocument | IDistributerDocument | ITheaterOwnerDocument | IUserDocument | null = null;

            if(this.type === "Admin") {
                data = await Admins.findOne({ _id: decoded.id });
            }else if(this.type === "Distributer") {
                data = await Distributers.findOne({ _id: decoded.id });
            }else if(this.type === "TheaterOwner") {
                data = await TheaterOwners.findOne({ _id: decoded.id });
            }else if(this.type === "User") {
                data = await Users.findOne({ _id: decoded.id });
            }

            if(!data) {
                throw new JWTTokenError({ statusCode: StatusCodes.BadRequest, message: 'Invaild Token' });
            }else if(this.type !== "Admin" && (data as IDistributerDocument | ITheaterOwnerDocument | IUserDocument).isBlocked) {
                res.cookie('token', '', { expires: new Date(Date.now()) }); // clearing cookie

                throw new AuthenticationError({message: 'Account is blocked.', statusCode: StatusCodes.Unauthorized, errorField: "blocked"});
            }

            req.id = data.id as string;

            next();
        } catch (err: any) {
            next(err);
        }
    }
}