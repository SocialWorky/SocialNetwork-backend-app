import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailsController } from './mails.controller';
import { MailsService } from './mails.service';
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
    WebhookModule,
  ],
  controllers: [MailsController],
  providers: [MailsService],
  exports: [MailsService, TypeOrmModule],
})
export class MailsModule {}