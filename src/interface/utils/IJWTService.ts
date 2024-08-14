export interface IPayload {
    id: string,
    type: string
}

export default interface IJWTService {
    sign(payload: IPayload): string | never;
    verifyToken(token: string): IPayload | never;
}