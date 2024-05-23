import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { Publication } from './entities/publications.entity';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
} from './dto/publication.dto';
import { PublicationService } from './publication.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Role } from '../../common/enums/rol.enum';

@ApiTags('Publications')
@Auth(Role.USER)
@Controller('publications')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post('create')
  @ApiBearerAuth()
  async createPublication(
    @Body() createPublicationDto: CreatePublicationDto,
  ): Promise<{ message: string; publications: any }> {
    return this.publicationService.createPublication(createPublicationDto);
  }

  @Get('all')
  @ApiBearerAuth()
  async getAllPublications(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ): Promise<Publication[]> {
    return this.publicationService.getAllPublications(page, pageSize);
  }

  @Get('count')
  @ApiBearerAuth()
  async countPublications(): Promise<number> {
    return this.publicationService.getCountPublications();
  }

  @Get(':_id')
  @ApiBearerAuth()
  async getPublicationById(@Param('_id') _id: string): Promise<Publication> {
    return this.publicationService.getPublicationById(_id);
  }

  @Put('edit/:_id')
  @ApiBearerAuth()
  async updatePublication(
    @Param('_id') _id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ): Promise<{ message: string }> {
    return this.publicationService.updatePublication(_id, updatePublicationDto);
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  async deletePublication(@Param('id') id: string): Promise<void> {
    return this.publicationService.deletePublication(id);
  }
}
