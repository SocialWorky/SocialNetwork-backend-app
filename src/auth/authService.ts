import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { environment } from '../environments/environment';

@Injectable()
export class AuthService {
  private secretKey = environment.SECRET_KEY;

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

  validateUser(signedUser): User {
    return jwt.verify(signedUser, this.secretKey);
  }
}
