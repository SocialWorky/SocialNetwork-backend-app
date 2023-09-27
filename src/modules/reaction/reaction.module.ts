import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomReactionModule } from '../customReaction/customReaction.module';
import { CustomReaction } from '../customReaction/entities/customReaction.entity';
import { Reaction } from './entities/reaction.entity';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { AuthModule } from '../../auth/auth.module';
import { User } from '../users/entities/user.entity';
import { Publication } from '../publications/entities/publications.entity';
import { Comment } from '../comment/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reaction,
      CustomReaction,
      User,
      Publication,
      Comment,
    ]),
    CustomReactionModule,
    AuthModule,
  ],
  providers: [ReactionService],
  controllers: [ReactionController],
})
export class ReactionModule {}
