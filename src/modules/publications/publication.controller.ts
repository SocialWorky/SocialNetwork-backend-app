import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Publication } from './entities/publications.entity';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
} from './dto/publication.dto';
import { PublicationService } from './publication.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Publications')
@Controller('publications')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @ApiBearerAuth()
  async createPublication(
    @Body() createPublicationDto: CreatePublicationDto,
  ): Promise<{ message: string }> {
    return this.publicationService.createPublication(createPublicationDto);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  @ApiBearerAuth()
  async getAllPublications(): Promise<Publication[]> {
    return this.publicationService.getAllPublications();
  }

  @UseGuards(AuthGuard)
  @Get(':_id')
  @ApiBearerAuth()
  async getPublicationById(@Param('_id') _id: string): Promise<Publication> {
    return this.publicationService.getPublicationById(_id);
  }

  @UseGuards(AuthGuard)
  @Put('edit/:_id')
  @ApiBearerAuth()
  async updatePublication(
    @Param('_id') _id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ): Promise<{ message: string }> {
    return this.publicationService.updatePublication(_id, updatePublicationDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  @ApiBearerAuth()
  async deletePublication(@Param('id') id: string): Promise<void> {
    return this.publicationService.deletePublication(id);
  }
}
