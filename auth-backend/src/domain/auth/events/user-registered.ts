import { Event } from "src/domain/common/event";

export class UserRegister extends Event {
    type = 'auth.user.registered';

    getBody() {
        return {
            auth: {
                uuid: this.payload.uuid,
                email: this.payload.email
            },
        };
    }
}