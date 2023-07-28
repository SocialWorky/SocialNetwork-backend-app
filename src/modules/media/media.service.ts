import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../../entities/media.entity';
import { CreateMediaDto } from './dto/media.dto';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private authService: AuthService,
  ) {}

  async createMedia(createMediaDto: CreateMediaDto): Promise<Media> {
    const { url } = createMediaDto;

    const media = new Media();
    media._id = this.authService.cryptoIdKey();
    media.url = url;

    return this.mediaRepository.save(media);
  }

  async getAllMedia(): Promise<Media[]> {
    return this.mediaRepository.find();
  }

  async getMediaById(_id: string): Promise<Media> {
    return this.mediaRepository.findOneBy({ _id: _id });
  }

  async deleteMedia(_id: string): Promise<void> {
    await this.mediaRepository.delete(_id);
  }
}
