// interfaces
import { IDistributerDocument } from "../collections/IDistributer.collection";
import { ITheaterOwnerDocument } from "../collections/ITheaterOwner.collection";
import { IUserDocument } from "../collections/IUsers.collections";

export interface IAdminUseCase {
    getAllUsersData(): Promise<IUserDocument[] | never>;
    getAllTheaterOwnersData(): Promise<ITheaterOwnerDocument[] | never>;
    getAllDistributersData(): Promise<IDistributerDocument[] | never>
}