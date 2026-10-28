import Redis from "ioredis";

export const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    lazyConnect: true,
    retryStrategy(times) {
        if (times > 3) {
            return null;
        }
        return Math.min(times * 100, 2000);
    },
});

redis.on("error", (err) => {
    console.warn("Redis client error:", err.message);
});