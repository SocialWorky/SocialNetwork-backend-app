import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagUsers } from '../../entities/tag.entity';
import { TagsUsersController } from './tagsUsers.controller';
import { TagsUsersService } from './tagsUsers.service';
import { AuthModule } from '../../auth/auth.module';
import { AuthController } from 'src/auth/auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TagUsers]), AuthModule],
  providers: [TagsUsersService, AuthController],
  controllers: [TagsUsersController],
})
export class TagsUsersModule {}
