import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Friendship } from './entities/friend.entity';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}
  @ApiBearerAuth()
  @Get(':userId')
  async getFriends(@Param('userId') userId: string): Promise<User[]> {
    return this.friendsService.getFriends(userId);
  }

  @ApiBearerAuth()
  @Get('isfriend/:userId/:friendId')
  async getIsMyFriend(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
  ): Promise<Friendship> {
    return this.friendsService.getIsMyFriend(userId, friendId);
  }

  @ApiBearerAuth()
  @Post('request')
  async sendFriendRequest(
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
  ): Promise<{ message: string }> {
    return this.friendsService.sendFriendRequest(senderId, receiverId);
  }

  @ApiBearerAuth()
  @Put('accept/:friendshipId')
  @HttpCode(204)
  async acceptFriendRequest(
    @Param('friendshipId') friendshipId: string,
  ): Promise<string> {
    await this.friendsService.acceptFriendRequest(friendshipId);
    return 'Friend request accepted successfully.';
  }

  @ApiBearerAuth()
  @Delete(':id')
  async removeFriend(@Param('id') id: string): Promise<Friendship> {
    return await this.friendsService.removeFriend(id);
  }

  @ApiBearerAuth()
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
