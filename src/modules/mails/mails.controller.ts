import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MailsService } from './mails.service';
import { UsersService } from '../users/users.service';
import { MailerDataValidate } from './entities/mail.entity';

@ApiTags('Email')
@Controller('email')
export class MailsController {
  constructor(
    private readonly _mailsService: MailsService,
    private readonly _usersService: UsersService,
  ) {}

  @Post('validate/:token')
  validateEmail(@Param('token') token: string) {
    return this._mailsService.getEmailValidate(token);
  }

  @Post('forgotPassword')
  async forgotPasswordSend(@Body() data: MailerDataValidate) {
    const user = await this._usersService.findOneByEmail(data.email);
    if (!user) {
      throw new HttpException(
        'Email not exist in the database or is invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this._mailsService.sendEmailForgotPassword(data);
  }

  @Post('resetPassword')
  async resetPassword(@Body() data: MailerDataValidate) {
    return this._mailsService.sendEmailResetPassword(data);
  }
}
