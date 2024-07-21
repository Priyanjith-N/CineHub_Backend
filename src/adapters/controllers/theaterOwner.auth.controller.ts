import { Request, Response, NextFunction } from "express";

// interfaces
import { ITheaterOwnerAuthenticationController, ITheaterOwnerLoginCredentials } from "../../interface/controllers/theaterOwner.IAuth.controller";
import ITheaterOwnerAuthUseCase from "../../interface/usecase/theaterOwner.IAuth.usecase";

//enums
import { StatusCodes } from "../../enums/statusCode.enum";

export default class TheaterOwnerAuthenticationController implements ITheaterOwnerAuthenticationController {
    private theaterOwnerAuthUseCase: ITheaterOwnerAuthUseCase;

    constructor(theaterOwnerAuthUseCase: ITheaterOwnerAuthUseCase) {
        this.theaterOwnerAuthUseCase = theaterOwnerAuthUseCase;
    }

    async handleLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const {
                email,
                password
            }: ITheaterOwnerLoginCredentials = req.body;

            // usecase for authenticateing theater owners
            const token: string = await this.theaterOwnerAuthUseCase.authenticateUser(email, password); // return token or throw an error

            res.cookie('token', token, { httpOnly: true }); // Set http only cookie for token

            res.status(StatusCodes.Success).json({
                message: "Successfuly login"
            });
        } catch (err: any) {
            next(err);
        }
    }
}