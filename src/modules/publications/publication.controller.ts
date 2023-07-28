import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { Publication } from './entities/publications.entity';
import { CreatePublicationDto } from './dto/publication.dto';
import { PublicationService } from './publication.service';

@Controller('api/publications')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  async createPublication(
    @Body() createPublicationDto: CreatePublicationDto,
  ): Promise<Publication> {
    return this.publicationService.createPublication(createPublicationDto);
  }

  @Get()
  async getAllPublications(): Promise<Publication[]> {
    return this.publicationService.getAllPublications();
  }

  @Get(':id')
  async getPublicationById(@Param('id') id: string): Promise<Publication> {
    return this.publicationService.getPublicationById(id);
  }

  @Put(':id')
  async updatePublication(
    @Param('id') id: string,
    @Body() updatePublicationDto: CreatePublicationDto,
  ): Promise<Publication> {
    return this.publicationService.updatePublication(id, updatePublicationDto);
  }

  @Delete(':id')
  async deletePublication(@Param('id') id: string): Promise<void> {
    return this.publicationService.deletePublication(id);
  }
}
