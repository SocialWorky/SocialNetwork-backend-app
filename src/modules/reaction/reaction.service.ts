import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './entities/reaction.entity';
import { CreateReactionDto } from './dto/reaction.dto';
import { CustomReaction } from '../customReaction/entities/customReaction.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
    @InjectRepository(CustomReaction)
    private readonly customReactionRepository: Repository<CustomReaction>,
  ) {}

  async createReaction(
    createReactionDto: CreateReactionDto,
  ): Promise<Reaction> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user, customReaction } = createReactionDto;

    // Obtener la entidad CustomReaction asociada al customReactionId
    const customReactionRes = await this.customReactionRepository.find({
      where: { _id: customReaction },
    });

    if (!customReactionRes) {
      throw new Error('La reacción personalizada no existe');
    }

    const reaction = new Reaction();
    //reaction.user = user;
    reaction.customReaction = customReactionRes[0];

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
