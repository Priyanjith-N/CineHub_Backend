import * as bcrypt from 'bcrypt';

// interfaces
import IHashingService from '../../interface/utils/IHashingService';

export default class HashingService implements IHashingService {
    private salt: number = 10;
    
    async hash(data: string): Promise<string | never> {
        try {
            return await bcrypt.hash(data, this.salt);
        } catch (err: any) {
            throw err;
        }
    }

    async compare(normalData: string, hashedData: string): Promise<boolean | never> {
        try {
            return await bcrypt.compare(normalData, hashedData);
        } catch (err: any) {
            throw err;
        }
    }
}