import { Injectable } from "@nestjs/common";
import { redis } from "src/infrastructure/redis/redis";

@Injectable()
export class OtpStorageService {
    private buildKey(identifier: string, type: string = "register"): string {
        return `otp:${type}:${identifier.toLowerCase()}`;
    }

    async saveOtp(identifier: string, otp: string, type: string = "register", ttlSeconds: number = 300): Promise<void> {
        const key = this.buildKey(identifier, type);
        await redis.set(key, otp, "EX", ttlSeconds);
    }

    async getOtp(identifier: string, type: string = "register"): Promise<string | null> {
        const key = this.buildKey(identifier, type);
        return await redis.get(key);
    }

    async removeOtp(identifier: string, type: string = "register"): Promise<void> {
        const key = this.buildKey(identifier, type);
        await redis.del(key);
    }
}
