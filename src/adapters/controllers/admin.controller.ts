// interfaces
import { Request, Response, NextFunction } from "express";
import { IAdminController } from "../../interface/controllers/admin.controller.interface";
import { IAdminUseCase } from "../../interface/usecase/admin.usecase.interface";
import { IUserDocument } from "../../interface/collections/IUsers.collections";
import { INotVerifiedDistributers, INotVerifiedTheaterOwners } from "../../interface/repositories/admin.repository.interface";

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

    async blockOrUnblockUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId: string | undefined = req.params.id;
            const isBlocked: boolean | undefined = req.body.isBlocked;

            await this.adminUseCase.blockOrUnblockUser(userId, isBlocked);

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull',
            });
        } catch (err: any) {
            next(err);
        }
    }

    async blockOrUnblockTheaterOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const theaterOwnerId: string | undefined = req.params.id;
            const isBlocked: boolean | undefined = req.body.isBlocked;

            await this.adminUseCase.blockOrUnblockTheaterOwner(theaterOwnerId, isBlocked);

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull',
            });
        } catch (err: any) {
            next(err);
        }
    }

    async blockOrUnblockDistributer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const distributerId: string | undefined = req.params.id;
            const isBlocked: boolean | undefined = req.body.isBlocked;

            await this.adminUseCase.blockOrUnblockDistributer(distributerId, isBlocked);

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull',
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllDocumentVerificationRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: (INotVerifiedDistributers | INotVerifiedTheaterOwners)[] = await this.adminUseCase.getAllDocumentVerificationRequest();

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull',
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async changeDocumentVerificationStatusTheaterOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: string | undefined = req.params.id;
            const status: string | undefined = req.body.status;
            const message: string | undefined = req.body.message;

            await this.adminUseCase.changeDocumentVerificationStatusTheaterOwner(id, status, message);

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull'
            });
        } catch (err: any) {
            next(err)
        }
    }

    async changeDocumentVerificationStatusDistributer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: string | undefined = req.params.id;
            const status: string | undefined = req.body.status;
            const message: string | undefined = req.body.message;

            await this.adminUseCase.changeDocumentVerificationStatusDistributer(id, status, message);

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull'
            });
        } catch (err: any) {
            next(err)
        }
    }

    async getTheaterOwnerData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: string | undefined = req.params.id;

            const data: INotVerifiedTheaterOwners = await this.adminUseCase.getTheaterOwner(id);

            console.log(data);
            

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull',
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getDistributerData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: string | undefined = req.params.id;

            const data: INotVerifiedDistributers = await this.adminUseCase.getDistributer(id);

            res.status(StatusCodes.Success).json({
                message: 'Sucessfull',
                data
            });
        } catch (err: any) {
            next(err);
        }
    }
}