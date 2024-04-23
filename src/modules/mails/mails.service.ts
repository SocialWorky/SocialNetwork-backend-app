import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../users/entities/user.entity';
import { AuthService } from '../../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MailsService {
  constructor(
    private readonly _authService: AuthService,
    private _mailerService: MailerService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async sendEmailValidate(id: string) {
    const user = await this.userRepository.findOneBy({
      _id: id,
    });
    const tokenEmail = this._authService.tokenEmail(user);
    const host = process.env.HOT_FRONTEND;

    const url = `${host}auth/validate/${tokenEmail}`;
    this._mailerService.sendMail({
      to: user.email,
      subject: 'Bienvenido a Worky app!',
      template: './welcome',
      context: {
        name: user.name + ' ' + user.lastName,
        url,
      },
    });
  }

  async getEmailValidate(token: string) {
    try {
      const user = await this._authService.validateToken(token);
      const userId = user.id;

      await this.userRepository.update(userId, { isVerified: true });

      return {
        message: 'User verified successfully',
        userId: userId,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
