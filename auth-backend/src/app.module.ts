import { Module } from "@nestjs/common";
import { TypeOrmModule } from "./infrastructure/database/typorm.config";
import AppController from "./app.controller";
import { AuthModule } from "./feature/user.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule,
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "15m" },
    })
    
  ],
  controllers: [AppController],
})

export class AppModule {}
