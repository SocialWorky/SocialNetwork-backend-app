import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CustomReaction } from './entities/customReaction.entity';
import { CreateCustomReactionDto } from './dto/customReaction.dto';
import { CustomReactionService } from './customReaction.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@ApiTags('Custom Reactions')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Auth(Role.USER)
@Controller('custom-reactions')
export class CustomReactionController {
  constructor(private readonly customReactionService: CustomReactionService) {}

  @Auth(Role.ADMIN)
  @Post('create')
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

  @Auth(Role.ADMIN)
  @Delete('delete/:_id')
  async deleteCustomReaction(@Param('_id') _id: string): Promise<void> {
    return this.customReactionService.deleteCustomReaction(_id);
  }
}
