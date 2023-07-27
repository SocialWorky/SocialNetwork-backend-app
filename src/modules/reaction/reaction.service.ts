import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from '../../entities/reaction.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
  ) {}

  async createReaction(reaction: Reaction): Promise<Reaction> {
    return this.reactionRepository.save(reaction);
  }

  async getReactionById(_id: string): Promise<Reaction> {
    return this.reactionRepository.findOneBy({ _id: _id });
  }

  async getAllReactions(): Promise<Reaction[]> {
    return this.reactionRepository.find();
  }

  async updateReaction(
    _id: string,
    reactionData: Partial<Reaction>,
  ): Promise<Reaction> {
    const reaction = await this.reactionRepository.findOne({
      where: { _id: _id },
    });
    if (!reaction) {
      throw new Error('Reaction not found');
    }
    Object.assign(reaction, reactionData);
    return this.reactionRepository.save(reaction);
  }

  async deleteReaction(_id: string): Promise<void> {
    await this.reactionRepository.delete(_id);
  }
}
