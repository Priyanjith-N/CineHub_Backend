export interface IDistributer {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    licence: string;
    idProof: string;
    idProofImage: string[];
    OTPVerificationStatus: boolean;
    documentVerificationStatus: string;
    distributedMoviesList: string[],
    licenceUpdateDocument: string | undefined | null
    licenceUpdateVerificationStatus: boolean;
    idProofUpdateVerificationStatus: boolean;
    idProofUpdateDocumentImage: string[] | undefined | null;
    isBlocked: boolean;
}

export interface IDistributerList {
    _id: string;
    name: string;
    distributedMoviesList: string[];
}