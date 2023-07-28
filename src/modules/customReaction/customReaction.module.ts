import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomReaction } from '../../entities/customReaction.entity';
import { CustomReactionController } from './customReaction.controller';
import { CustomReactionService } from './customReaction.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CustomReaction]), AuthModule],
  controllers: [CustomReactionController],
  providers: [CustomReactionService],
})
export class CustomReactionModule {}
