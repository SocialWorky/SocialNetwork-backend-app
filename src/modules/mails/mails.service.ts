import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CreateMailDto } from './dto/create-mail.dto';
import { AuthService } from '../../auth/auth.service';
import { Email } from './entities/mail.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class MailsService {
  private readonly logger = new Logger(MailerService.name);

  constructor(
    private readonly _authService: AuthService,
    private _mailerService: MailerService,
    private _usersService: UsersService,

    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async saveEmailNotSent(mailData: CreateMailDto) {
    const email = new Email();
    email._id = this._authService.cryptoIdKey();
    email.token = mailData.token ? mailData.token : '';
    email.email = mailData.email;
    email.password = mailData.password ? mailData.password : '';
    email.url = mailData.url ? mailData.url : '';
    email.subject = mailData.subject;
    email.title = mailData.title;
    email.greet = mailData.greet;
    email.message = mailData.message;
    email.subMessage = mailData.subMessage;
    email.buttonMessage = mailData.buttonMessage;
    email.template = mailData.template ? mailData.template : '';
    email.templateLogo = mailData.templateLogo ? mailData.templateLogo : '';
    return await this.emailRepository.save(email);
  }

  async sendEmailPending() {
    const emails = await this.emailRepository.find();
    for (const email of emails) {
      const user = await this._usersService.findOneByEmail(email.email);
      await this.sendEmailWithRetry(user._id, email);
      await this.delay(2000);
      await this.deleteEmailSent(email._id);
    }
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async deleteEmailSent(id: string) {
    const email = await this.emailRepository.findOne({ where: { _id: id } });
    if (!email) {
      throw new UnauthorizedException('Email not found');
    }
    return await this.emailRepository.remove(email);
  }

  async sendEmailWithRetry(
    id: string = '',
    mailData: CreateMailDto,
    retries: number = 3,
    delayMs: number = 2000,
  ) {
    try {
      if (mailData.template === 'welcome') {
        await this.sendEmailValidate(id, mailData);
      }
      if (mailData.template === 'forgot-password') {
        await this.sendEmailForgotPassword(mailData);
      }
      if (mailData.template === 'reset-password') {
        await this.sendEmailResetPassword(mailData);
      }
      if (mailData.template === 'notification') {
        await this.sendNotification(mailData);
      }
      if (mailData.template === 'email') {
        await this.sendEmail(mailData);
      }
    } catch (error) {
      if (retries > 0) {
        this.logger.error(`Error sending email: ${error.message}. Retrying...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        await this.sendEmailWithRetry(id, mailData, retries - 1, delayMs);
      } else {
        this.logger.error(
          `Failed to send email after ${retries} retries: ${error.message}`,
        );
        await this.saveEmailNotSent(mailData);
        throw new Error('Failed to send email');
        // here you can save the emails that were not sent in the database
      }
    }
  }

  async sendEmailValidate(id: string, mailData: CreateMailDto) {
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
    const templateLogo = mailData.templateLogo;
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
          templateLogo,
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

  async sendEmailForgotPassword(mailData: CreateMailDto) {
    const user = await this.userRepository.findOneBy({ email: mailData.email });
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
    const templateLogo = mailData.templateLogo;
    try {
      await this._mailerService.sendMail({
        to: user.email,
        subject: mailData.subject,
        template: './forgot-password',
        context: {
          name: user.name + ' ' + user.lastName,
          url,
          title,
          greet,
          message,
          subMessage,
          buttonMessage,
          templateLogo,
        },
      });
      this.logger.log(`Email sent to ${user.email}`);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendEmailResetPassword(mailData: CreateMailDto) {
    const user = await this.userRepository.findOneBy({ email: mailData.email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const validToken = await this._authService.validateToken(mailData.token);
    if (!validToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const newPassword = await bcrypt.hash(mailData.password, 10);

    await this.userRepository.update(user._id, { password: newPassword });

    const url = `${mailData.url}`;
    const title = mailData.title;
    const greet = mailData.greet;
    const message = mailData.message;
    const subMessage = mailData.subMessage;
    const buttonMessage = mailData.buttonMessage;
    const templateLogo = mailData.templateLogo;
    try {
      await this._mailerService.sendMail({
        to: user.email,
        subject: mailData.subject,
        template: './forgot-password',
        context: {
          name: user.name + ' ' + user.lastName,
          url,
          title,
          greet,
          message,
          subMessage,
          buttonMessage,
          templateLogo,
        },
      });
      this.logger.log(`Email sent to ${user.email}`);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendNotification(mailData: CreateMailDto) {
    const user = await this.userRepository.findOneBy({ email: mailData.email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    try {
      await this._mailerService.sendMail({
        to: user.email,
        subject: mailData.subject,
        template: './notification',
        context: {
          name: user.name + ' ' + user.lastName,
          url: mailData.url,
          title: mailData.title,
          greet: mailData.greet,
          message: mailData.message,
          subMessage: mailData.subMessage, // HTML content
          buttonMessage: mailData.buttonMessage,
          templateLogo: mailData.templateLogo,
        },
      });
      this.logger.log(`Email sent to ${user.email}`);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendEmail(mailData: CreateMailDto) {
    try {
      await this._mailerService.sendMail({
        to: mailData.email,
        subject: mailData.subject,
        template: './email',
        context: {
          url: mailData.url,
          title: mailData.title,
          greet: mailData.greet,
          message: mailData.message,
          subMessage: mailData.subMessage, // HTML content
          buttonMessage: mailData.buttonMessage,
          templateLogo: mailData.templateLogo,
        },
      });
      this.logger.log(`Email sent to ${mailData.email}`);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

}
