import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Friendship } from './entities/friend.entity';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@ApiTags('Friends')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}
  @Get(':userId')
  async getFriends(@Param('userId') userId: string): Promise<User[]> {
    return this.friendsService.getFriends(userId);
  }

  @Get('isfriend/:userId/:friendId')
  async getIsMyFriend(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
  ): Promise<Friendship> {
    return this.friendsService.getIsMyFriend(userId, friendId);
  }

  @Post('request')
  async sendFriendRequest(
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
  ): Promise<{ message: string }> {
    return this.friendsService.sendFriendRequest(senderId, receiverId);
  }

  @Put('accept/:friendshipId')
  @HttpCode(204)
  async acceptFriendRequest(
    @Param('friendshipId') friendshipId: string,
  ): Promise<string> {
    await this.friendsService.acceptFriendRequest(friendshipId);
    return 'Friend request accepted successfully.';
  }

  @Delete(':id')
  async removeFriend(@Param('id') id: string): Promise<Friendship> {
    return await this.friendsService.removeFriend(id);
  }

  @Put('block/:receiverId')
  @HttpCode(204)
  async blockFriend(
    @Param('receiverId') receiverId: string,
    @Body('senderId') senderId: string,
  ): Promise<string> {
    await this.friendsService.blockUser(senderId, receiverId);
    return 'User blocked successfully.';
  }
}
