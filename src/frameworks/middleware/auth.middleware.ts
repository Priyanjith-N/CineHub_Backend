import { NextFunction, Response } from "express";

// collections
import Admins from "../models/admin.model";
import Distributers from "../models/distributer.model";
import TheaterOwners from "../models/theaterOwner.model";
import Users from "../models/user.model";

// interfaces
import IAuthMiddleware, { AuthRequest } from "../../interface/middlewares/authMiddleware.interface";
import IJWTService, { IPayload } from "../../interface/utils/IJWTService";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";

// errors
import JWTTokenError from "../../errors/jwt.error";
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
            const authorizationHeader: string | undefined = req.headers.authorization;

            if(!authorizationHeader) {
                throw new JWTTokenError({ tokenName: "Token", message: "NOT AUTHENTICATED", statusCode: StatusCodes.Unauthorized });
            }

            const token = authorizationHeader.split(' ')[1];

            const decoded: IPayload = this.jwtService.verifyToken(token);

            if(decoded.type !== this.type || !isObjectIdOrHexString(decoded.id)) {
                throw new JWTTokenError({ tokenName: "Token", statusCode: StatusCodes.BadRequest, message: 'Invaild Token' });
            }

            req.id = decoded.id;

            next();
        } catch (err: any) {
            next(err);
        }
    }
}