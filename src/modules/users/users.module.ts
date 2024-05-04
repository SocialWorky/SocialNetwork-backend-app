import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../../auth/auth.module';
import { MailsService } from '../mails/mails.service';
import { Email } from '../mails/entities/mail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Email]), AuthModule],
  providers: [UsersService, MailsService],
  controllers: [UsersController],
  exports: [TypeOrmModule, UsersService, MailsService],
})
export class UsersModule {}
