import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { User } from '../modules/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  signIn(user: User) {
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  constructor(private jwtService: JwtService) {}

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
    const hash = crypto.createHash('sha256');
    hash.update(Date.now().toString());
    hash.update(this.randomKey());
    return '_' + hash.digest('hex');
  }
}
