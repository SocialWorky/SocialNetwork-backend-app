import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';

@Catch(TokenExpiredError)
export class JwtExpiredFilter implements ExceptionFilter {
  catch(exception: TokenExpiredError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(HttpStatus.UNAUTHORIZED).json({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'The token has expired',
      error: 'Unauthorized',
    });
  }
}
