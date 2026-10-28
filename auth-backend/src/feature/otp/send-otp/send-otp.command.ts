export class SendOtpCommand {
    constructor(
        public readonly email: string,
        public readonly type: string = "register",
    ) { }
}
