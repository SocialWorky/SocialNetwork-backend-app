import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../../entities/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async createMedia(media: Media): Promise<Media> {
    return this.mediaRepository.save(media);
  }

  async getMediaById(_id: string): Promise<Media> {
    return this.mediaRepository.findOneBy({ _id: _id });
  }

  async getAllMedia(): Promise<Media[]> {
    return this.mediaRepository.find();
  }

  async updateMedia(_id: string, mediaData: Partial<Media>): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { _id: _id },
    });
    if (!media) {
      throw new Error('Media not found');
    }
    Object.assign(media, mediaData);
    return this.mediaRepository.save(media);
  }

  async deleteMedia(id: number): Promise<void> {
    await this.mediaRepository.delete(id);
  }
}
