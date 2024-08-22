import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Media } from './entities/postMediaFiles.entity';
import { CreateMediaDto } from './dto/media.dto';
import { MediaService } from './postMediaFiles.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guard/auth.guard';

@ApiTags('MediaFiles')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('create')
  async createMedia(
    @Body() createMediaDto: CreateMediaDto,
  ): Promise<{ message: string }> {
    return this.mediaService.createMedia(createMediaDto);
  }

  @Get(':_id')
  async getMediaById(@Param('_id') _id: string): Promise<Media> {
    return this.mediaService.getMediaById(_id);
  }

  @Delete('delete/:_id')
  async deleteMedia(@Param('_id') _id: string): Promise<void> {
    return this.mediaService.deleteMedia(_id);
  }
}
