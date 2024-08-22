import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { Friendship } from './entities/friend.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friendship, User]), AuthModule],
  providers: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
