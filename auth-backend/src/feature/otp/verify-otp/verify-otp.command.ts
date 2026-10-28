import { Role } from "src/domain/auth/enums/role.enum";

export class VerifyOtpCommand {
    constructor(
        public readonly email: string,
        public readonly otp: string,
        public readonly type: string = "register",
        public readonly password?: string,
        public readonly uuid?: string,
        public readonly role?: Role,
    ) { }
}
