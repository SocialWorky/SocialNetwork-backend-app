import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MailsController } from './mails.controller';
import { MailsService } from './mails.service';

import { join } from 'path';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Email } from './entities/mail.entity';

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
        },
        defaults: {
          from: `"Worky-No Reply" <${process.env.MAIL_FROM}>`,
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
  ],
  providers: [MailsService],
  exports: [MailsService, TypeOrmModule],
  controllers: [MailsController],
})
export class MailsModule {}
