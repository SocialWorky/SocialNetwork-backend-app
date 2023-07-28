import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  private secretKey = this.randomKey();

  signIn(user: User) {
    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    };
    const options = {
      expiresIn: '1h',
    };
    return jwt.sign(payload, this.secretKey, options);
  }

  validateUser(signedUser): string | object {
    return jwt.verify(signedUser, this.secretKey);
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
