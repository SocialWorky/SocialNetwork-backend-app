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
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('MediaFiles')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @ApiBearerAuth()
  async createMedia(
    @Body() createMediaDto: CreateMediaDto,
  ): Promise<{ message: string }> {
    return this.mediaService.createMedia(createMediaDto);
  }

  @UseGuards(AuthGuard)
  @Get(':_id')
  @ApiBearerAuth()
  async getMediaById(@Param('_id') _id: string): Promise<Media> {
    return this.mediaService.getMediaById(_id);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:_id')
  @ApiBearerAuth()
  async deleteMedia(@Param('_id') _id: string): Promise<void> {
    return this.mediaService.deleteMedia(_id);
  }
}
