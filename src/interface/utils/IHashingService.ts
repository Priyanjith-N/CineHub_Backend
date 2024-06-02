export default interface IHashingService {
    hash(data: string): Promise<string>;
    compare(normalData: string, hashedData: string): Promise<boolean>;
}