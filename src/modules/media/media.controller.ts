import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Media } from '../../entities/media.entity';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  async createMedia(@Body() media: Media): Promise<Media> {
    return this.mediaService.createMedia(media);
  }

  @Get(':_id')
  async getMediaById(@Param('_id') _id: string): Promise<Media> {
    return this.mediaService.getMediaById(_id);
  }

  @Get()
  async getAllMedia(): Promise<Media[]> {
    return this.mediaService.getAllMedia();
  }

  @Put(':_id')
  async updateMedia(
    @Param('_id') _id: string,
    @Body() mediaData: Partial<Media>,
  ): Promise<Media> {
    return this.mediaService.updateMedia(_id, mediaData);
  }

  @Delete(':id')
  async deleteMedia(@Param('id') id: number): Promise<void> {
    return this.mediaService.deleteMedia(id);
  }
}
