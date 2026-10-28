import { Module, Controller, Get, UseGuards } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { ProfileModule } from './feature/profile/profile.module';
import { FollowModule } from './feature/following/following.module';
import { PostModule } from './feature/post/post.module';
import { OutboxService } from './feature/services/outbox.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { RedisModule } from '@nestjs-modules/ioredis';

@Controller()
class AppController {
  @UseGuards(FirebaseAuthGuard)
  @Get()
  root() {
    return { message: 'NestJS Backend is running!' };
  }
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // CacheModule.register({isGlobal: true}),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),

    ProfileModule,
    FollowModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [
    OutboxService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor,
    // },
  ],
})
export class AppModule {}
