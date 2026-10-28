import { Body, Controller, Post, HttpCode, HttpStatus, Res } from "@nestjs/common";
import { Response } from "express";
import { VerifyOtpHandler } from "./verify-otp.handler";
import { VerifyOtpDto } from "./verify-otp.dto";
import { VerifyOtpCommand } from "./verify-otp.command";
const jwt = require("jsonwebtoken");

@Controller("auth")
export class VerifyOtpController {
    constructor(
        private readonly handler: VerifyOtpHandler,
    ) { }

    @Post("verify-otp")
    async verifyOtp(
        @Body() data: VerifyOtpDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const command = new VerifyOtpCommand(
            data.email,
            data.otp,
            data.type,
            data.password,
            data.uuid,
            data.role,
        );
        const result = await this.handler.handle(command);

        if (result.user) {
            const token = jwt.sign(
                {
                    userId: result.user.id,
                    uuid: result.user.uuid,
                    email: result.user.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: "8h" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 8,
            });

            res.cookie("access_token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 1000 * 60 * 60 * 1,
            });

            return {
                ...result,
                token,
            };
        }

        return result;
    }
}
