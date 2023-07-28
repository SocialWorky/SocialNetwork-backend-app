import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { Media } from './entities/media.entity';
import { CreateMediaDto } from './dto/media.dto';
import { MediaService } from './media.service';

@Controller('api/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  async createMedia(@Body() createMediaDto: CreateMediaDto): Promise<Media> {
    return this.mediaService.createMedia(createMediaDto);
  }

  @Get()
  async getAllMedia(): Promise<Media[]> {
    return this.mediaService.getAllMedia();
  }

  @Get(':_id')
  async getMediaById(@Param('_id') _id: string): Promise<Media> {
    return this.mediaService.getMediaById(_id);
  }

  @Delete(':_id')
  async deleteMedia(@Param('_id') _id: string): Promise<void> {
    return this.mediaService.deleteMedia(_id);
  }
}
