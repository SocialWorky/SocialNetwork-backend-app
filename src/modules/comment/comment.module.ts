import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationModule } from '../publications/publication.module';
import { Publication } from '../../entities/publications.entity';
import { Comment } from '../../entities/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Publication]),
    AuthModule,
    PublicationModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
