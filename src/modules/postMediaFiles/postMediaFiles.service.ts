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
import { Comment } from '../comment/entities/comment.entity';
import { CreateMediaDto } from './dto/media.dto';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,

    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async createMedia(createMediaDto: CreateMediaDto) {
    if (createMediaDto.isPublications && createMediaDto.isComment) {
      throw new BadRequestException(
        'You can only choose one option between isPublications and isComment',
      );
    }

    const media = new Media();
    media._id = this.authService.cryptoIdKey();
    media.url = createMediaDto.url;
    media.urlThumbnail = createMediaDto.urlThumbnail;
    media.urlCompressed = createMediaDto.urlCompressed;

    if (createMediaDto.isPublications) {
      const publication = await this.publicationRepository.findOne({
        where: { _id: createMediaDto._idPublication },
      });

      if (!publication) {
        throw new BadRequestException('Publication not found');
      }

      media.isPublications = true;
      media.isComment = false;
      media.publication = publication;
    }

    if (createMediaDto.isComment) {
      const comment = await this.commentRepository.findOne({
        where: { _id: createMediaDto._idPublication },
      });

      if (!comment) {
        throw new BadRequestException('Comment not found');
      }

      media.isPublications = false;
      media.isComment = true;
      media.comment = comment;
    }

    await this.mediaRepository.save(media);

    return { message: 'Media created successfully' };
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
