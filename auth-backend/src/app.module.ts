import { Module } from "@nestjs/common";
import { TypeOrmModule } from "./infrastructure/database/typorm.config";
import AppController from "./app.controller";
import { AuthModule } from "./feature/user.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
    AuthModule,
    
  ],
  controllers: [AppController],
})

export class AppModule {}
