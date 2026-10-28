import { MailerModule as Mailer } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    Mailer.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = process.env.MAIL_HOST || config.get<string>('MAIL_HOST') || 'localhost';
        const port = Number(process.env.MAIL_PORT || config.get('MAIL_PORT') || 1025);
        const username = process.env.MAIL_USERNAME || config.get<string>('MAIL_USERNAME');
        const password = process.env.MAIL_PASSWORD || config.get<string>('MAIL_PASSWORD');
        const authType = process.env.MAIL_AUTH || config.get<string>('MAIL_AUTH', 'no_auth');

        const transport: any = {
          host,
          port,
          secure: port === 465,
        };

        if (authType === 'login' && username && password) {
          transport.auth = {
            user: username,
            pass: password,
          };
        }

        return {
          transport,
          defaults: {
            from: config.get<string>('MAIL_SENDER_EMAIL', 'no-reply@udaan.com'),
          },
        };
      },
    }),
  ],
  exports: [Mailer],
})
export class MailerModule {}