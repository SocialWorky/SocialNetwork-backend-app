import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import * as crypto from 'crypto';

@Controller('api/key')
export class AuthController {
  @Get('random')
  @ApiExcludeEndpoint()
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
