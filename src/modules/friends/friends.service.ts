import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Friendship } from './entities/friend.entity';
import { Status } from '../../common/enums/status.enum';
@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friendship)
    private readonly friendshipRepository: Repository<Friendship>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getFriends(userId: string): Promise<User[]> {
    const friendships = await this.friendshipRepository.find({
      where: {
        status: Status.ACCEPTED,
      },
      relations: ['requester', 'receiver'],
    });

    return friendships
      .filter((friendship) => friendship.requester._id === userId)
      .map((friendship) => friendship.receiver);
  }

  async sendFriendRequest(
    senderId: string,
    receiverId: string,
  ): Promise<{ message: string; friendshipId: string }> {
    const sender = await this.userRepository.findOne({
      where: { _id: senderId },
    });
    const receiver = await this.userRepository.findOne({
      where: { _id: receiverId },
    });

    if (!sender || !receiver) {
      throw new Error('User not found');
    }

    const existingRequest = await this.friendshipRepository.findOne({
      where: { requester: sender } && { receiver: receiver } && {
          status: Status.PENDING,
        },
    });

    const existingFriendship = await this.friendshipRepository.findOne({
      where: { requester: sender } && { receiver: receiver } && {
          status: Status.ACCEPTED,
        },
    });

    if (existingRequest) {
      if (existingRequest.isBlocked) {
        throw new ConflictException(
          'Cannot send friend request, one of the users is blocked.',
        );
      }
      throw new ConflictException(
        'you have already sent a friend request to this user.',
      );
    }

    if (existingFriendship) {
      throw new ConflictException('You are already friends with this user.');
    }

    const friendship = new Friendship();
    friendship.requester = sender;
    friendship.receiver = receiver;
    friendship.status = Status.PENDING;

    const savedFriendship = await this.friendshipRepository.save(friendship);
    return {
      message: 'Friend request sent successfully.',
      friendshipId: savedFriendship.id,
    };
  }

  async acceptFriendRequest(friendshipId: string): Promise<void> {
    const friendship = await this.friendshipRepository.findOne({
      where: { id: friendshipId } && { status: Status.PENDING },
      relations: ['requester', 'receiver'],
    });

    if (!friendship) {
      throw new Error('Pending friendship request not found');
    }

    friendship.status = Status.ACCEPTED;
    await this.friendshipRepository.save(friendship);

    const reverseFriendship = await this.friendshipRepository.findOne({
      where: { requester: friendship.receiver } && {
          receiver: friendship.requester,
        } && { status: Status.ACCEPTED },
    });

    if (!reverseFriendship) {
      const newFriendship = new Friendship();
      newFriendship.requester = friendship.receiver;
      newFriendship.receiver = friendship.requester;
      newFriendship.status = Status.ACCEPTED;
      await this.friendshipRepository.save(newFriendship);
    }
  }

  async removeFriend(senderId: string, receiverId: string): Promise<void> {
    const friendships = await this.friendshipRepository.find({
      where: [
        {
          requester: { _id: senderId },
          receiver: { _id: receiverId },
          status: Status.ACCEPTED,
        },
        {
          requester: { _id: receiverId },
          receiver: { _id: senderId },
          status: Status.ACCEPTED,
        },
      ],
    });

    if (friendships.length === 0) {
      throw new Error('Friendship not found');
    }

    await this.friendshipRepository.remove(friendships);
  }

  async blockUser(senderId: string, receiverId: string): Promise<void> {
    const sender = await this.userRepository.findOne({
      where: { _id: senderId },
    });
    const receiver = await this.userRepository.findOne({
      where: { _id: receiverId },
    });

    if (!sender || !receiver) {
      throw new Error('User not found');
    }

    const existingFriendship = await this.friendshipRepository.findOne({
      where: { requester: sender } && { receiver: receiver } && {
          status: Status.ACCEPTED,
        },
    });

    if (existingFriendship) {
      existingFriendship.isBlocked = true;
      existingFriendship.blockedBy = sender;
      existingFriendship.status = Status.BLOCKED;
      await this.friendshipRepository.save(existingFriendship);
    } else {
      const newFriendship = new Friendship();
      newFriendship.requester = sender;
      newFriendship.receiver = receiver;
      newFriendship.isBlocked = true;
      newFriendship.blockedBy = sender;
      newFriendship.status = Status.BLOCKED;
      await this.friendshipRepository.save(newFriendship);
    }
  }
}
