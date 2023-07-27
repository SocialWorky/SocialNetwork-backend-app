import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomReaction } from '../../entities/customReaction.entity';
import { CreateCustomReactionDto } from './dto/customReaction.dto';

@Injectable()
export class CustomReactionService {
  constructor(
    @InjectRepository(CustomReaction)
    private readonly customReactionRepository: Repository<CustomReaction>,
  ) {}

  async createCustomReaction(
    createCustomReactionDto: CreateCustomReactionDto,
  ): Promise<CustomReaction> {
    const { name, emoji } = createCustomReactionDto;

    const customReaction = new CustomReaction();
    customReaction.name = name;
    customReaction.emoji = emoji;

    return this.customReactionRepository.save(customReaction);
  }

  async getAllCustomReactions(): Promise<CustomReaction[]> {
    return this.customReactionRepository.find();
  }
}
