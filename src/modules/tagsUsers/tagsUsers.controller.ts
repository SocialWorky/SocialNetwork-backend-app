import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CreateTagDto, UpdateTagDto } from './dto/tagsUsers.dto';
import { TagUsers } from '../../entities/tag.entity';
import { TagsUsersService } from './tagsUsers.service';

@Controller('tags')
export class TagsUsersController {
  constructor(private readonly tagService: TagsUsersService) {}

  @Post('create')
  async createTag(@Body() createTagDto: CreateTagDto): Promise<TagUsers> {
    return this.tagService.createTag(createTagDto);
  }

  @Get(':_id')
  async getTagById(@Param('_id') _id: string): Promise<TagUsers> {
    return this.tagService.getTagById(_id);
  }

  @Get()
  async getAllTags(): Promise<TagUsers[]> {
    return this.tagService.getAllTags();
  }

  @Put(':_id')
  async updateTag(
    @Param('_id') _id: string,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<TagUsers> {
    return this.tagService.updateTag(_id, updateTagDto);
  }

  @Delete(':_id')
  async deleteTag(@Param('_id') _id: string): Promise<void> {
    return this.tagService.deleteTag(_id);
  }
}
