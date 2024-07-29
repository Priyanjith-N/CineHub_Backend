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
    getAllDocumentVerificationPendingData(): Promise<(INotVerifiedDistributers | INotVerifiedTheaterOwners)[]>;
    changeDocumentVerificationStatusTheaterOwner(id: string, status: string): Promise<string | undefined | never>;
    changeDocumentVerificationStatusDistributer(id: string, status: string): Promise<string | undefined | never>;
    getTheaterOwner(id: string): Promise<INotVerifiedTheaterOwners | undefined | never>
    getDistributer(id: string): Promise<INotVerifiedDistributers | undefined | never>;
}

export interface INotVerifiedTheaterOwners {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    idProof: string;
    idProofImage: string[];
    OTPVerificationStatus: boolean;
    documentVerificationStatus: string;
    idProofUpdateVerificationStatus: boolean;
    idProofUpdateDocumentImage: string[] | null | undefined;
    isBlocked: boolean;
    role: string;
}

export interface INotVerifiedDistributers {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    licence: string;
    idProof: string;
    idProofImage: string[];
    OTPVerificationStatus: boolean;
    documentVerificationStatus: string;
    licenceUpdateDocument: string | undefined | null;
    licenceUpdateVerificationStatus: boolean;
    idProofUpdateVerificationStatus: boolean;
    idProofUpdateDocumentImage: string[] | undefined | null;
    isBlocked: boolean;
    role: string;
}