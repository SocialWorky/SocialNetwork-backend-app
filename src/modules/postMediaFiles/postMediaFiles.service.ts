import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './entities/postMediaFiles.entity';
import { Publication } from '../publications/entities/publications.entity';
import { CreateMediaDto } from './dto/media.dto';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,

    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async createMedia(createMediaDto: CreateMediaDto) {
    let publication: Publication = null;
    if (createMediaDto.isPublications) {
      publication = await this.publicationRepository.findOneBy({
        _id: createMediaDto._idPublication,
      });
    }

    if (publication === null) {
      throw new BadRequestException('Publication or Comment not found');
    }

    const media = new Media();
    media._id = this.authService.cryptoIdKey();
    media.url = createMediaDto.url;
    media.publication = publication;
    media.isPublications = createMediaDto.isPublications;
    media.isComment = createMediaDto.isComment;

    await this.mediaRepository.save({ ...media });

    return { message: 'Publication created successfully' };
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
