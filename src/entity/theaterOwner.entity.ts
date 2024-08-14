export default interface ITheaterOwner {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    idProof: string;
    idProofImage: string[];
    OTPVerificationStatus: boolean;
    documentVerificationStatus: string;
    idProofUpdateVerificationStatus: boolean;
    idProofUpdateDocumentImage: string[] | null | undefined;
    isBlocked: boolean;
}