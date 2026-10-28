import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { SendOtpHandler } from "./send-otp.handler";
import { SendOtpDto } from "./send-otp.dto";
import { SendOtpCommand } from "./send-otp.command";

@Controller("auth")
export class SendOtpController {
    constructor(
        private readonly handler: SendOtpHandler,
    ) { }

    @Post("send-otp")
    async sendOtp(@Body() data: SendOtpDto) {
        const command = new SendOtpCommand(data.email, data.type);
        return await this.handler.handle(command);
    }

}
