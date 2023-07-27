import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from 'src/entities/reaction.entity';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { AuthModule } from '../../auth/auth.module';
import { AuthController } from 'src/auth/auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction]), AuthModule],
  providers: [ReactionService, AuthController],
  controllers: [ReactionController],
})
export class ReactionModule {}
