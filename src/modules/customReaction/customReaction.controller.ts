import { Controller, Get, Post, Body } from '@nestjs/common';
import { CustomReaction } from '../../entities/customReaction.entity';
import { CreateCustomReactionDto } from './dto/customReaction.dto';
import { CustomReactionService } from './customReaction.service';

@Controller('api/custom-reactions')
export class CustomReactionController {
  constructor(private readonly customReactionService: CustomReactionService) {}

  @Post()
  async createCustomReaction(
    @Body() createCustomReactionDto: CreateCustomReactionDto,
  ): Promise<CustomReaction> {
    return this.customReactionService.createCustomReaction(
      createCustomReactionDto,
    );
  }

  @Get()
  async getAllCustomReactions(): Promise<CustomReaction[]> {
    return this.customReactionService.getAllCustomReactions();
  }
}
