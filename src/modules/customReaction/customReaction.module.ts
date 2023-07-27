import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomReaction } from '../../entities/customReaction.entity';
import { CustomReactionController } from './customReaction.controller';
import { CustomReactionService } from './customReaction.service';
import { AuthModule } from '../../auth/auth.module';
import { AuthController } from 'src/auth/auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomReaction]), AuthModule],
  controllers: [CustomReactionController],
  providers: [CustomReactionService, AuthController],
})
export class CustomReactionModule {}
