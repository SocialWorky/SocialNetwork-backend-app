import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTagDto } from './dto/tagsUsers.dto';
import { TagUsers } from './entities/tagUsers.entity';
import { TagsUsersService } from './tagsUsers.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';

@ApiTags('Tagging')
@Auth(Role.USER)
@Controller('tags')
export class TagsUsersController {
  constructor(private readonly tagService: TagsUsersService) {}

  @Post('create')
  @ApiBearerAuth()
  async createTag(
    @Body() createTagDto: CreateTagDto,
  ): Promise<{ message: string }> {
    return this.tagService.createTag(createTagDto);
  }

  @Get(':_idPublication')
  @ApiBearerAuth()
  async getTagById(
    @Param('_idPublication') _idPublication: string,
  ): Promise<TagUsers> {
    const tag = await this.tagService.getTagById(_idPublication);

    if (!tag) {
      throw new HttpException(
        'The _id entered does not correspond to any publication.',
        HttpStatus.NOT_FOUND,
      );
    }

    return tag;
  }

  @Delete(':_id')
  @ApiBearerAuth()
  async deleteTag(@Param('_id') _id: string): Promise<void> {
    return this.tagService.deleteTag(_id);
  }
}
