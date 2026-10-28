// import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
// import { ConfigModule, ConfigService } from "@nestjs/config";
// import { redisStore } from "cache-manager-redis-store";

// export const RedisOptions: CacheModuleAsyncOptions = {
//     isGlobal: true,
//     imports: [ConfigModule],
//     useFactory: async(configService: ConfigService) => {
//         const store = await redisStore({
//             socket: {
//                 host: 'redis',
//                 post: 6379,
//             }
//         });
//         return {
//             store: () => store,
//         }
//     },
//     inject: [ConfigService],
// }

// // redis-cli -u redis://default:r6rrShZyyrieDCzI9sfwr2PENTewAb9R@redis-10402.c57.us-east-1-4.ec2.cloud.redislabs.com:10402
