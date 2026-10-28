import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OtpSenderService {
    private readonly logger = new Logger(OtpSenderService.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) { }

    async send(recipient: string, otp: string, type: string = "register"): Promise<void> {
        this.logger.log(`[OTP DISPATCH] (${type}) Sending OTP to ${recipient}`);

        const senderEmail = this.configService.get<string>('MAIL_SENDER_EMAIL') || 'no-reply@udaan.com';

        try {
            await this.mailerService.sendMail({
                to: recipient,
                from: senderEmail,
                subject: `Your Verification Code: ${otp}`,
                text: `Your OTP for ${type} is: ${otp}. It will expire in 5 minutes.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
                        <h2 style="color: #222; text-align: center; margin-bottom: 24px;">Verification Code</h2>
                        <p style="font-size: 15px; color: #444; line-height: 1.5;">Hello,</p>
                        <p style="font-size: 15px; color: #444; line-height: 1.5;">
                            Please use the following code to verify your <strong>${type}</strong> request:
                        </p>
                        <div style="text-align: center; margin: 28px 0;">
                            <span style="display: inline-block; font-size: 30px; font-weight: bold; letter-spacing: 6px; color: #2563eb; background-color: #eff6ff; padding: 12px 24px; border-radius: 6px; border: 1px dashed #bfdbfe;">
                                ${otp}
                            </span>
                        </div>
                        <p style="font-size: 13px; color: #666; line-height: 1.4;">
                            This code will expire in <strong>5 minutes</strong>. If you did not initiate this request, you can safely ignore this email.
                        </p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0 16px;" />
                        <p style="font-size: 12px; color: #999; text-align: center;">Udaan Authentication Service</p>
                    </div>
                `,
            });
            this.logger.log(`[OTP DISPATCH] Email successfully sent to ${recipient}`);
        } catch (error: any) {
            this.logger.error(`Failed to send OTP email to ${recipient}: ${error.message}`);
            if (process.env.NODE_ENV === 'production') {
                throw error;
            }
        }
    }
}
