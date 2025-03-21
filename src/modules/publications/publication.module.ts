import { forwardRef, Module } from '@nestjs/common';
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
import { Friendship } from '../friends/entities/friend.entity';
import { ConfigModule } from '../config/config.module';
import { InvitationCodeModule } from '../invitationCode/invitation-code.module';
import { RecordsLogsModule } from '../records-logs/records-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publication, Comment, Friendship]),
    AuthModule,
    forwardRef(() => UsersModule),
    MediaModule,
    ConfigModule,
    InvitationCodeModule,
    RecordsLogsModule,
  ],
  controllers: [PublicationController],
  providers: [PublicationService, UsersService, MediaService],
  exports: [TypeOrmModule, PublicationService],
})
export class PublicationModule {}
