import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../modules/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  signIn(user: User) {
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      name: user.name + ' ' + user.lastName,
      role: user.role,
      avatar: user.avatar,
      isTooltipActive: user.isTooltipActive,
    };
    return this.jwtService.sign(payload);
  }

  tokenEmail(user: User) {
    const payload = {
      id: user._id,
      email: user.email,
    };

    // Expiration time: 3 hours
    const expirationTime = 3 * 60 * 60;

    return this.jwtService.sign(payload, { expiresIn: expirationTime });
  }

  renewToken(user: User) {
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      name: user.name + ' ' + user.lastName,
      role: user.role,
      avatar: user.avatar,
      isTooltipActive: user.isTooltipActive,
    };

    const expirationTime = 12 * 60 * 60;

    return this.jwtService.sign(payload, { expiresIn: expirationTime });
  }

  validateUser(signedUser): string | object {
    return this.jwtService.verify(signedUser);
  }

  randomKey() {
    const secretKey = crypto.randomBytes(32).toString('hex');
    return secretKey;
  }

  cryptoUserKey(email, password) {
    const hash = crypto.createHash('sha256');
    hash.update(email);
    hash.update(password);
    return '_' + hash.digest('hex');
  }

  cryptoIdKey() {
    const customUUID = '_' + uuidv4();
    const trimmedUUID = customUUID.substring(0, 50);
    return trimmedUUID;
  }

  validateToken(token: string): any {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async validateTokenGoogle(token: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const client = new OAuth2Client(clientId);
    try {
      const verify = await client.verifyIdToken({
        idToken: token,
        audience: clientId,
      });
      const user = verify.getPayload();
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
