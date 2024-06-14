import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomReaction } from './entities/customReaction.entity';
import { CreateCustomReactionDto } from './dto/customReaction.dto';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class CustomReactionService {
  constructor(
    @InjectRepository(CustomReaction)
    private readonly customReactionRepository: Repository<CustomReaction>,
    private authService: AuthService,
  ) {}

  async createCustomReaction(
    createCustomReactionDto: CreateCustomReactionDto,
  ): Promise<CustomReaction> {
    const { name, emoji } = createCustomReactionDto;

    const customReaction = new CustomReaction();
    customReaction._id = this.authService.cryptoIdKey();
    customReaction.name = name;
    customReaction.emoji = emoji;

    return this.customReactionRepository.save(customReaction);
  }

  async getAllCustomReactions(): Promise<CustomReaction[]> {
    return await this.customReactionRepository.find({
      where: { deletedAt: null },
    });
  }

  async deleteCustomReaction(id: string): Promise<void> {
    await this.customReactionRepository.update(id, { deletedAt: new Date() });
  }
}
