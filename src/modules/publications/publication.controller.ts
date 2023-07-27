import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Publication } from '../../entities/publications.entity';
import { PublicationService } from './publication.service';

@Controller('api/publications')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  async createPublication(
    @Body() publication: Publication,
  ): Promise<Publication> {
    return this.publicationService.createPublication(publication);
  }

  @Get(':_id')
  async getPublicationById(@Param('_id') _id: string): Promise<Publication> {
    return this.publicationService.getPublicationById(_id);
  }

  @Get()
  async getAllPublications(): Promise<Publication[]> {
    return this.publicationService.getAllPublications();
  }

  @Put(':_id')
  async updatePublication(
    @Param('_id') _id: string,
    @Body() publicationData: Partial<Publication>,
  ): Promise<Publication> {
    return this.publicationService.updatePublication(_id, publicationData);
  }

  @Delete(':_id')
  async deletePublication(@Param('_id') _id: string): Promise<void> {
    return this.publicationService.deletePublication(_id);
  }
}
