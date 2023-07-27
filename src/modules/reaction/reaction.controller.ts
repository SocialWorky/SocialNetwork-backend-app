import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Reaction } from '../../entities/reaction.entity';
import { ReactionService } from './reaction.service';

@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  async createReaction(@Body() reaction: Reaction): Promise<Reaction> {
    return this.reactionService.createReaction(reaction);
  }

  @Get(':_id')
  async getReactionById(@Param('_id') _id: string): Promise<Reaction> {
    return this.reactionService.getReactionById(_id);
  }

  @Get()
  async getAllReactions(): Promise<Reaction[]> {
    return this.reactionService.getAllReactions();
  }

  @Put(':_id')
  async updateReaction(
    @Param('_id') _id: string,
    @Body() reactionData: Partial<Reaction>,
  ): Promise<Reaction> {
    return this.reactionService.updateReaction(_id, reactionData);
  }

  @Delete(':id')
  async deleteReaction(@Param('_id') _id: string): Promise<void> {
    return this.reactionService.deleteReaction(_id);
  }
}
