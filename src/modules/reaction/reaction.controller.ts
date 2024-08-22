import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CreateReactionDto } from './dto/reaction.dto';
import { Reaction } from './entities/reaction.entity';
import { ReactionService } from './reaction.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Role } from '../../common/enums/rol.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@ApiTags('Reactions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Auth(Role.USER)
@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post('create')
  async createReaction(
    @Body() createReactionDto: CreateReactionDto,
  ): Promise<{ message: string }> {
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

  @Put('edit/:id')
  async updateReaction(
    @Param('id') id: string,
    @Body() reactionData: CreateReactionDto,
  ): Promise<Reaction> {
    return this.reactionService.updateReaction(id, reactionData);
  }

  @Delete('delete/:id')
  async deleteReaction(@Param('id') id: string): Promise<void> {
    return this.reactionService.deleteReaction(id);
  }
}
