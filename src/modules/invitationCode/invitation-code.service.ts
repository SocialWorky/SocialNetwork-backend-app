// src/invitation-code/invitation-code.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvitationCode } from './entities/invitation-code.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InvitationCodeService {
  constructor(
    @InjectRepository(InvitationCode)
    private readonly invitationCodeRepository: Repository<InvitationCode>,
  ) {}

  /**
   * Genera un código de invitación para un email dado.
   * Si el email ya existe, devuelve el código existente.
   */
  async generate(email: string): Promise<InvitationCode> {
    const existingCode = await this.invitationCodeRepository.findOneBy({ email });
    if (existingCode) {
      return existingCode;
    }

    const newCode = new InvitationCode();
    newCode.email = email;
    newCode.code = uuidv4();
    return this.invitationCodeRepository.save(newCode);
  }

  /**
   * Valida si un código pertenece a un email específico.
   */
  async validate(email: string, code: string): Promise<boolean> {
    const invitationCode = await this.invitationCodeRepository.findOneBy({ email, code });
    return !!invitationCode;
  }

  /**
   * Obtiene todos los códigos de invitación.
   */
  async findAll(): Promise<InvitationCode[]> {
    return this.invitationCodeRepository.find();
  }
}
