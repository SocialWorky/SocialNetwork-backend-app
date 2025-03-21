import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publication } from '../publications/entities/publications.entity';
import { User } from '../users/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { MediaModule } from '../postMediaFiles/postMediaFiles.module';
import { MediaService } from '../postMediaFiles/postMediaFiles.service';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Publication, User]),
    AuthModule,
    MediaModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [CommentController],
  providers: [CommentService, MediaService],
  exports: [TypeOrmModule, CommentService],
})
export class CommentModule {}
