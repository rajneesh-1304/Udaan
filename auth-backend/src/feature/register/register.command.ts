export class RegisterCommand {
    constructor(
        public readonly register: {
            uuid: string,
            email: string,
            password: string,
            provider: string,
            role: string,
            provider_id: string
        }
    ){}
}