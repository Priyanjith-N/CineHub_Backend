export default interface IHashingService {
    hash(data: string): Promise<string | never>;
    compare(normalData: string, hashedData: string): Promise<boolean | never>;
}