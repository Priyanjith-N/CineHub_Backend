// interfaces
import { IOTPDocument } from "../collections/IOTP.collections";

export default interface IOTPRepository {
    createOTP(email: string, otp: string): Promise<void | never>;
    getOTPByEmail(email: string): Promise<IOTPDocument | null | never>;
}