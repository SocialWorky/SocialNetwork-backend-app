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
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { CreateTagDto, UpdateTagDto } from './dto/tagsUsers.dto';
import { TagUsers } from './entities/tag.entity';
import { TagsUsersService } from './tagsUsers.service';
import { AuthGuard } from '../../auth/auth.guard';

@ApiTags('User Tagging')
@Controller('tags')
export class TagsUsersController {
  constructor(private readonly tagService: TagsUsersService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @ApiExcludeEndpoint()
  async createTag(@Body() createTagDto: CreateTagDto): Promise<TagUsers> {
    return this.tagService.createTag(createTagDto);
  }

  @Get(':_id')
  async getTagById(@Param('_id') _id: string): Promise<TagUsers> {
    return this.tagService.getTagById(_id);
  }

  @Get('all')
  async getAllTags(): Promise<TagUsers[]> {
    return this.tagService.getAllTags();
  }

  @UseGuards(AuthGuard)
  @Put('update/:_id')
  @ApiBearerAuth()
  async updateTag(
    @Param('_id') _id: string,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<TagUsers> {
    return this.tagService.updateTag(_id, updateTagDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delet/:_id')
  @ApiBearerAuth()
  async deleteTag(@Param('_id') _id: string): Promise<void> {
    return this.tagService.deleteTag(_id);
  }
}
