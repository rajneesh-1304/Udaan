import { v4 } from 'uuid';

export abstract class Event {
    id: string;
    appId: string;
    fired_at: Date;
    payload: any;

    constructor(payload) {
        this.id = v4();
        this.appId = process.env.APP_NAME,
        this.fired_at = new Date(),
        this.payload = payload
    }

    abstract type: string;
    abstract getBody(): any;

    getId() {
        return this.id;
    }

    getType() {
        return this.type;
    }

    getFiredAt() {
        return this.fired_at;
    }

    getHeaders() {
        return {
            type: this.getType(),
            content_type: 'application/json',
        };
    }

    getPayload() {
        return {
            uuid: this.getId(),
            fired_at: this.getFiredAt(),
            ...this.getBody(),
        };
    }
    
    getProperties() {
        return {
            messageId: this.getId(),
            type: this.getType(),
            appId: this.appId,
            contentType: 'application/json',
            headers: this.getHeaders(),
        };
    }
}