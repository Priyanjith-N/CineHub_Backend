// interfaces
import { IDistributerDocument } from "../collections/IDistributer.collection";
import { ITheaterOwnerDocument } from "../collections/ITheaterOwner.collection";
import { IUserDocument } from "../collections/IUsers.collections";
import { IDistributerData, INotVerifiedDistributers, INotVerifiedTheaterOwners, ITheaterOwnerData } from "../repositories/admin.repository.interface";

export interface IAdminUseCase {
    getAllUsersData(): Promise<IUserDocument[] | never>;
    getAllTheaterOwnersData(): Promise<ITheaterOwnerDocument[] | never>;
    getAllDistributersData(): Promise<IDistributerDocument[] | never>;
    blockOrUnblockUser(id: string | undefined, isBlocked: boolean | undefined): Promise<void | never>;
    blockOrUnblockTheaterOwner(id: string | undefined, isBlocked: boolean | undefined): Promise<void | never>;
    blockOrUnblockDistributer(id: string | undefined, isBlocked: boolean | undefined): Promise<void | never>;
    getAllDocumentVerificationRequest(): Promise<(INotVerifiedDistributers | INotVerifiedTheaterOwners)[]>;
    changeDocumentVerificationStatusTheaterOwner(id: string | undefined, status: string | undefined,  message: string | undefined): Promise<void | never>;
    changeDocumentVerificationStatusDistributer(id: string | undefined, status: string | undefined,  message: string | undefined): Promise<void | never>;
    getTheaterOwner(id: string | undefined): Promise<ITheaterOwnerData | never>;
    getDistributer(id: string | undefined): Promise<IDistributerData | never>
    
}