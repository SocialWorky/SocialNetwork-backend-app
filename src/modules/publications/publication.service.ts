import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from '../../entities/publications.entity';

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
  ) {}

  async createPublication(publication: Publication): Promise<Publication> {
    return this.publicationRepository.save(publication);
  }

  async getPublicationById(_id: string): Promise<Publication> {
    return this.publicationRepository.findOneBy({ _id: _id });
  }

  async getAllPublications(): Promise<Publication[]> {
    return this.publicationRepository.find();
  }

  async updatePublication(
    _id: string,
    publicationData: Partial<Publication>,
  ): Promise<Publication> {
    const publication = await this.publicationRepository.findOne({
      where: { _id: _id },
    });
    if (!publication) {
      throw new Error('Publication not found');
    }
    Object.assign(publication, publicationData);
    return this.publicationRepository.save(publication);
  }

  async deletePublication(_id: string): Promise<void> {
    await this.publicationRepository.delete(_id);
  }
}
