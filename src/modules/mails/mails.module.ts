import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailsController } from './mails.controller';
import { MailsService } from './mails.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Email } from './entities/mail.entity';
import { WebhookModule } from '../webhook/webhook.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Email]),
    AuthModule,
    UsersModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST,
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
          // Solo para desarrollo
          // tls: {
          //  rejectUnauthorized: false,
          // },
        },
        defaults: {
          from: `"${process.env.APP_NAME} - No Reply" <${process.env.MAIL_FROM}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    WebhookModule,
  ],
  controllers: [MailsController],
  providers: [MailsService],
  exports: [MailsService, TypeOrmModule],
})
export class MailsModule {}
