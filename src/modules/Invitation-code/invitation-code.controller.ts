// src/invitation-code/invitation-code.controller.ts
import { Controller, Post, Get, Body, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { InvitationCodeService } from './invitation-code.service';
import { InvitationCode } from './entities/invitation-code.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../auth/decorators/auth.decorator';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { Role } from '../../common/enums/rol.enum';

@ApiTags('InvitationsCode')
@Controller('invitations-code')
export class InvitationCodeController {
  constructor(private readonly invitationCodeService: InvitationCodeService) {}

  @UseGuards(AuthGuard)
  @Auth(Role.ADMIN)
  @ApiBearerAuth()
  @Post('generate')
  async generate(@Body('email') email: string): Promise<InvitationCode> {
    if (!email || !this.isValidEmail(email)) {
      throw new HttpException('Invalid Email', HttpStatus.BAD_REQUEST);
    }
    return this.invitationCodeService.generate(email);
  }

  @Post('validate')
  async validate(@Body('email') email: string, @Body('code') code: string): Promise<boolean> {
    if (!email || !this.isValidEmail(email) || !code) {
      throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
    }
    return this.invitationCodeService.validate(email, code);
  }

  @UseGuards(AuthGuard)
  @Auth(Role.ADMIN)
  @ApiBearerAuth()
  @Get()
  async findAll(): Promise<InvitationCode[]> {
    return this.invitationCodeService.findAll();
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
