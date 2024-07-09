import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { CustomReaction } from './entities/customReaction.entity';
import { CreateCustomReactionDto } from './dto/customReaction.dto';
import { CustomReactionService } from './customReaction.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';

@ApiTags('Custom Reactions')
@Auth(Role.USER)
@Controller('custom-reactions')
export class CustomReactionController {
  constructor(private readonly customReactionService: CustomReactionService) {}

  @Auth(Role.ADMIN)
  @Post('create')
  @ApiBearerAuth()
  async createCustomReaction(
    @Body() createCustomReactionDto: CreateCustomReactionDto,
  ): Promise<CustomReaction> {
    return this.customReactionService.createCustomReaction(
      createCustomReactionDto,
    );
  }

  @Get()
  @ApiBearerAuth()
  async getAllCustomReactions(): Promise<CustomReaction[]> {
    return this.customReactionService.getAllCustomReactions();
  }

  @Auth(Role.ADMIN)
  @ApiBearerAuth()
  @Delete('delete/:_id')
  async deleteCustomReaction(@Param('_id') _id: string): Promise<void> {
    return this.customReactionService.deleteCustomReaction(_id);
  }
}
