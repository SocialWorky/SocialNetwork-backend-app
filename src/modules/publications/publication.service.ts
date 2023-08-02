import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from './entities/publications.entity';
import { User } from '../users/entities/user.entity';
import { Media } from '../media/entities/media.entity';
import { CreatePublicationDto } from './dto/publication.dto';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private authService: AuthService,
  ) {}

  async createPublication(createPublicationDto: CreatePublicationDto) {
    const publication = new Publication();
    publication._id = this.authService.cryptoIdKey();
    publication.content = createPublicationDto.content;
    publication.privacy = createPublicationDto.privacy;

    const author = await this.userRepository.findOneBy({
      _id: createPublicationDto.authorId,
    });
    if (!author) {
      throw new BadRequestException('Author not found');
    }

    return await this.publicationRepository.save({
      ...publication,
      author,
    });
  }

  async getAllPublications() {
    const publications = await this.publicationRepository
      .createQueryBuilder('publication')
      .leftJoinAndSelect('publication.author', 'author')
      .leftJoinAndSelect('publication.media', 'media')
      .select([
        'publication._id',
        'publication.content',
        'publication.privacy',
        'author._id',
        'author.username',
        'author.name',
        'author.lastName',
        'publication.createdAt',
        'publication.updatedAt',
        'media._id',
        'media.url',
      ])
      .getMany();
    return publications;
  }

  async getPublicationById(_id: string) {
    return await this.publicationRepository.findOneBy({ _id });
  }

  async updatePublication(
    _id: string,
    updatePublicationDto: CreatePublicationDto,
  ): Promise<Publication> {
    const publication = await this.publicationRepository.findOne({
      where: { _id: _id },
    });
    if (!publication) {
      throw new Error('Publication not found');
    }

    const { content, privacy } = updatePublicationDto;
    publication.content = content;
    publication.privacy = privacy;

    return this.publicationRepository.save(publication);
  }

  async deletePublication(id: string): Promise<void> {
    await this.publicationRepository.delete(id);
  }
}
