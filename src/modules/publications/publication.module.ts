import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { MediaModule } from '../postMediaFiles/postMediaFiles.module';
import { MediaService } from '../postMediaFiles/postMediaFiles.service';
import { Comment } from '../comment/entities/comment.entity';
import { Publication } from './entities/publications.entity';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publication, Comment]),
    AuthModule,
    UsersModule,
    MediaModule,
  ],
  controllers: [PublicationController],
  providers: [PublicationService, UsersService, MediaService],
  exports: [TypeOrmModule],
})
export class PublicationModule {}
