import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';

// interfaces
import { IGoogleAuthService } from '../../interface/utils/IGoogleAuthService';

export class GoogleAuthService implements IGoogleAuthService {
    private readonly client: OAuth2Client;

    constructor() {
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async verifyIdToken(idToken: string): Promise<TokenPayload | undefined | never> {
        try {
            const ticket: LoginTicket = await this.client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
            return ticket.getPayload();
        } catch (err: any) {
            throw err;
        }
    }
}