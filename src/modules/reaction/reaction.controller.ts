import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CreateReactionDto } from './dto/reaction.dto';
import { Reaction } from './entities/reaction.entity';
import { ReactionService } from './reaction.service';

@Controller('api/reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  async createReaction(
    @Body() createReactionDto: CreateReactionDto,
  ): Promise<Reaction> {
    return this.reactionService.createReaction(createReactionDto);
  }

  @Get(':id')
  async getReactionById(@Param('id') id: string): Promise<Reaction> {
    return this.reactionService.getReactionById(id);
  }

  @Get()
  async getAllReactions(): Promise<Reaction[]> {
    return this.reactionService.getAllReactions();
  }

  @Put(':id')
  async updateReaction(
    @Param('id') id: string,
    @Body() reactionData: Partial<Reaction>,
  ): Promise<Reaction> {
    return this.reactionService.updateReaction(id, reactionData);
  }

  @Delete(':id')
  async deleteReaction(@Param('id') id: string): Promise<void> {
    return this.reactionService.deleteReaction(id);
  }
}
