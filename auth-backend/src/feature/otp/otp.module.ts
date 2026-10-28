import { Module } from "@nestjs/common";
import { SendOtpModule } from "./send-otp/send-otp.module";
import { VerifyOtpModule } from "./verify-otp/verify-otp.module";

@Module({
    imports: [SendOtpModule, VerifyOtpModule],
    exports: [SendOtpModule, VerifyOtpModule],
})
export class OtpModule {}
