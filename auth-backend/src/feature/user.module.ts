import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { LogoutModule } from './logout/logout.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [LoginModule, LogoutModule, OtpModule],
  controllers: [],
  providers: [],
})
export class AuthModule { }
