import { Controller, Get, Post, Body, Param, Delete, Put, HttpCode } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { User } from '../users/entities/user.entity';


@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get(':userId')
  async getFriends(@Param('userId') userId: string): Promise<User[]> {
    return this.friendsService.getFriends(userId);
  }

  @Post('request')
async sendFriendRequest(
  @Body('senderId') senderId: string,
  @Body('receiverId') receiverId: string,
): Promise<{ message: string; friendshipId: string }> {
  return this.friendsService.sendFriendRequest(senderId, receiverId);
}

  @Put('accept/:friendshipId')
  @HttpCode(204)
  async acceptFriendRequest(@Param('friendshipId') friendshipId: string): Promise<string> {
    await this.friendsService.acceptFriendRequest(friendshipId);
    return 'Friend request accepted successfully.';
  }

  @Delete()
  async removeFriend(
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
  ): Promise<string> {
    await this.friendsService.removeFriend(senderId, receiverId);
    return 'Friend removed successfully.';
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
