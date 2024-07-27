// interfaces
import { Request, Response, NextFunction } from "express";
import { IAdminController } from "../../interface/controllers/admin.controller.interface";
import { IAdminUseCase } from "../../interface/usecase/admin.usecase.interface";
import { IUserDocument } from "../../interface/collections/IUsers.collections";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";
import { ITheaterOwnerDocument } from "../../interface/collections/ITheaterOwner.collection";
import { IDistributerDocument } from "../../interface/collections/IDistributer.collection";

export default class AdminController implements IAdminController {
    private adminUseCase: IAdminUseCase;

    constructor(adminUseCase: IAdminUseCase) {
        this.adminUseCase = adminUseCase;
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allUserData: IUserDocument[] = await this.adminUseCase.getAllUsersData();

            res.status(StatusCodes.Success).json({
                message: 'Sucessfully retrived users data',
                data: allUserData
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllTheaterOwners(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allTheaterOwnerData: ITheaterOwnerDocument[] = await this.adminUseCase.getAllTheaterOwnersData();

            res.status(StatusCodes.Success).json({
                message: 'Sucessfully retrived theater owners data',
                data: allTheaterOwnerData
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllDistributers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allDistributerData: IDistributerDocument[] = await this.adminUseCase.getAllDistributersData();

            res.status(StatusCodes.Success).json({
                message: 'Sucessfully retrived distributers data',
                data: allDistributerData
            });
        } catch (err: any) {
            next(err);
        }
    }
}