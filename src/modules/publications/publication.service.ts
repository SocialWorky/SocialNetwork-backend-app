import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from '../../entities/publications.entity';
import { CreatePublicationDto } from './dto/publication.dto';
import { User } from '../../entities/user.entity';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
    private authService: AuthService,
  ) {}

  async createPublication(
    createPublicationDto: CreatePublicationDto,
  ): Promise<Publication> {
    const { content, privacy, authorId } = createPublicationDto;

    const publication = new Publication();
    publication._id = this.authService.cryptoIdKey();
    publication.content = content;
    publication.privacy = privacy;

    const author = new User();
    author._id = authorId;
    publication.author = author;

    return this.publicationRepository.save(publication);
  }

  async getAllPublications(): Promise<Publication[]> {
    return this.publicationRepository.find();
  }

  async getPublicationById(_id: string): Promise<Publication> {
    return this.publicationRepository.findOneBy({ _id: _id });
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
