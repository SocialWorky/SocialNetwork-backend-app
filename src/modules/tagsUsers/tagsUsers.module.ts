import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagUsers } from './entities/tagUsers.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { TagsUsersController } from './tagsUsers.controller';
import { TagsUsersService } from './tagsUsers.service';
import { AuthModule } from '../../auth/auth.module';
import { Publication } from '../publications/entities/publications.entity';
import { Comment } from '../comment/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagUsers, User, Publication, Comment]),
    AuthModule,
    UsersModule,
  ],
  providers: [TagsUsersService],
  controllers: [TagsUsersController],
})
export class TagsUsersModule {}
