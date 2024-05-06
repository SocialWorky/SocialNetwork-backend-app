import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { MailsService } from './mails.service';
import { UsersService } from '../users/users.service';
import { CreateMailDto } from './dto/create-mail.dto';

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

  @ApiExcludeEndpoint()
  @Post('forgotPassword')
  async forgotPasswordSend(@Body() data: CreateMailDto) {
    const user = await this._usersService.findOneByEmail(data.email);
    if (!user) {
      throw new HttpException(
        'Email not exist in the database or is invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this._mailsService
      .sendEmailWithRetry(user._id, data)
      .then(() => {
        return {
          message: 'Email sent successfully',
          email: user.email,
        };
      })
      .catch(() => {
        return {
          message: 'Failed to send email',
          email: user.email,
        };
      });
  }

  @ApiExcludeEndpoint()
  @Post('resetPassword')
  async resetPassword(@Body() data: CreateMailDto) {
    const user = await this._usersService.findOneByEmail(data.email);
    if (!user) {
      throw new HttpException(
        'Email not exist in the database or is invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this._mailsService.sendEmailWithRetry(user._id, data).then(() => {
      return {
        message: 'Password reset successfully',
        email: user.email,
      };
    });
  }

  @ApiBearerAuth()
  @Get('sendEmailPending')
  async sendEmailPending() {
    return this._mailsService.sendEmailPending();
  }
}
