// interfaces
import { IDistributerDocument } from "../collections/IDistributer.collection";
import { ITheaterOwnerDocument } from "../collections/ITheaterOwner.collection";
import { IUserDocument } from "../collections/IUsers.collections";

export interface IAdminRepository {
    allUser(): Promise<IUserDocument[] | never>;
    allTheaterOwners(): Promise<ITheaterOwnerDocument[] | never>;
    allDistributers(): Promise<IDistributerDocument[] | never>;
    updateUserIsBlockedStatus(id: string, isBlocked: boolean): Promise<void | null>;
    updateTheaterOwnerIsBlockedStatus(id: string, isBlocked: boolean): Promise<void | null>;
    updateDistributerIsBlockedStatus(id: string, isBlocked: boolean): Promise<void | null>;
}