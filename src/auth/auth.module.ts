import { Module } from '@nestjs/common';
import { AuthService } from './authService';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
