import { Controller, Param, Post } from '@nestjs/common';
import { MailsService } from './mails.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Email')
@Controller('email')
export class MailsController {
  constructor(private readonly _mailsService: MailsService) {}

  @Post('validate/:token')
  validateEmail(@Param('token') token: string) {
    return this._mailsService.getEmailValidate(token);
  }
}
