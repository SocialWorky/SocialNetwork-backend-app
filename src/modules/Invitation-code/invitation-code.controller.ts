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

  /**
   * Genera un código de invitación para un email dado.
   */
  @UseGuards(AuthGuard)
  @Auth(Role.ADMIN)
  @ApiBearerAuth()
  @Post('generate')
  async generate(@Body('email') email: string): Promise<InvitationCode> {
    if (!email || !this.isValidEmail(email)) {
      throw new HttpException('Email inválido', HttpStatus.BAD_REQUEST);
    }
    return this.invitationCodeService.generate(email);
  }

  /**
   * Valida si un código pertenece a un email específico.
   */
  @Post('validate')
  async validate(@Body('email') email: string, @Body('code') code: string): Promise<boolean> {
    if (!email || !this.isValidEmail(email) || !code) {
      throw new HttpException('Parámetros inválidos', HttpStatus.BAD_REQUEST);
    }
    return this.invitationCodeService.validate(email, code);
  }

  /**
   * Obtiene todos los códigos de invitación.
   */
  @UseGuards(AuthGuard)
  @Auth(Role.ADMIN)
  @ApiBearerAuth()
  @Get()
  async findAll(): Promise<InvitationCode[]> {
    return this.invitationCodeService.findAll();
  }

  /**
   * Validación simple de email.
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
