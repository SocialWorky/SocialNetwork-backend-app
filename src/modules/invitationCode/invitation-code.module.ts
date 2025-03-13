import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationCode } from './entities/invitation-code.entity';
import { InvitationCodeService } from './invitation-code.service';
import { InvitationCodeController } from './invitation-code.controller';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([InvitationCode]), AuthModule],
  providers: [InvitationCodeService],
  controllers: [InvitationCodeController],
  exports: [InvitationCodeService],
})
export class InvitationCodeModule {}
