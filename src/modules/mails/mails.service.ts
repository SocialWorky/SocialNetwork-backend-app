import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../users/entities/user.entity';
import { MailDataValidate } from './entities/mail.entity';
import { AuthService } from '../../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MailsService {
  private readonly logger = new Logger(MailerService.name);

  constructor(
    private readonly _authService: AuthService,
    private _mailerService: MailerService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async sendEmailWithRetry(
    id: string,
    mailData: MailDataValidate,
    retries: number = 3,
    delayMs: number = 4000,
  ) {
    try {
      await this.sendEmailValidate(id, mailData);
    } catch (error) {
      if (retries > 0) {
        this.logger.error(`Error sending email: ${error.message}. Retrying...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        await this.sendEmailWithRetry(id, mailData, retries - 1, delayMs);
      } else {
        this.logger.error(
          `Failed to send email after ${retries} retries: ${error.message}`,
        );
        throw new Error('Failed to send email');
        // here you can save the emails that were not sent in the database
      }
    }
  }

  async sendEmailValidate(id: string, mailData: MailDataValidate) {
    if (!mailData) {
      throw new UnauthorizedException('Invalid mail data');
    }

    const user = await this.userRepository.findOneBy({ _id: id });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokenEmail = this._authService.tokenEmail(user);
    const url = `${mailData.url}${tokenEmail}`;
    const title = mailData.title;
    const greet = mailData.greet;
    const message = mailData.message;
    const subMessage = mailData.subMessage;
    const buttonMessage = mailData.buttonMessage;

    try {
      await this._mailerService.sendMail({
        to: user.email,
        subject: mailData.subject,
        template: './welcome',
        context: {
          name: user.name + ' ' + user.lastName,
          url,
          title,
          greet,
          message,
          subMessage,
          buttonMessage,
        },
      });
      this.logger.log(`Email sent to ${user.email}`);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
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
