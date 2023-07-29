import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
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

  @ApiOperation({
    summary: 'Get the tagged users by _id of the publication',
  })
  @ApiOkResponse({
    description: 'List of users tagged',
  })
  @ApiNotFoundResponse({
    description: 'There are no users tagged',
  })
  @Get(':_idPublication')
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
