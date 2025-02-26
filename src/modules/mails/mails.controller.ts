import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { MailsService } from './mails.service';
import { UsersService } from '../users/users.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { EventService } from '../webhook/event.service';
import { EventEnum } from '../webhook/enums/event.enum';

@ApiTags('Email')
@Controller('email')
export class MailsController {
  constructor(
    private readonly _mailsService: MailsService,
    private readonly _usersService: UsersService,
    private readonly _eventService: EventService,
  ) {}

  @Post('validate/:token')
  async validateEmail(@Param('token') token: string) {
    const response = await this._mailsService.getEmailValidate(token);
    const user = await this._usersService.findUserById(response['userId']);
    if (user) {
      this._eventService.emit(EventEnum.USER_EMAIL_VERIFIED, user);
    }
    return response;
  }

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

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('sendEmailPending')
  async sendEmailPending() {
    return this._mailsService.sendEmailPending();
  }

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('sendNotification')
  async sendNotification(@Body() data: CreateMailDto) {
    const user = await this._usersService.findOneByEmail(data.email);
    if (!user) {
      throw new HttpException(
        'Email not exist in the database or is invalid',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this._mailsService.sendEmailWithRetry(user._id, data).then(() => {
      return {
        message: 'Email notification send successfully',
        email: user.email,
      };
    });
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('sendEmail')
  async sendEmailNotification(@Body() data: CreateMailDto) {
    return this._mailsService.sendEmailWithRetry(null, data).then(() => {
      return {
        message: 'Email notification send successfully',
        email: data.email,
      };
    });
  }


}
