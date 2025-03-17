import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  Inject,
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
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AppLogger } from '../records-logs/logger.service';

@ApiTags('Publications')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Auth(Role.USER)
@Controller('publications')
export class PublicationController {
  constructor(
    private readonly publicationService: PublicationService,
    @Inject(AppLogger) private readonly _logger: AppLogger,
  ) {}

  @Post('create')
  async createPublication(
    @Body() createPublicationDto: CreatePublicationDto,
  ): Promise<{ message: string; publications: any }> {
    const publications = await this.publicationService.createPublication(createPublicationDto);

    if(publications.message === 'Publication created successfully') {
      this._logger.log(
        'Publication created successfully',
        'PublicationController createPublication',
        {
          publicationsId: publications.publications._id,
          author: publications.publications.author,
        }
      );
    } else {
      this._logger.error(
        'Publication Error',
        'PublicationController createPublication',
        {
          publications: publications,
        }
      );
    }

    return publications;
  }

  @Get('all')
  async getAllPublications(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('type') type?: string,
    @Query('consultId') consultId?: string,
    @Req() request?: Request,
  ): Promise<{ publications: Publication[]; total: number }> {
    const userId = request['user'].id;
    return this.publicationService.getAllPublications(
      page,
      pageSize,
      type,
      consultId,
      userId,
    );
  }

  @Get('count')
  async countPublications(): Promise<number> {
    return this.publicationService.getCountPublications();
  }

  @Get(':_id')
  async getPublicationById(@Param('_id') _id: string, @Req() request?: Request,): Promise<Publication[]> {
    const currentUserId = request['user'].id;
    return this.publicationService.getPublicationById(_id, currentUserId);
  }

  @Put('edit/:_id')
  async updatePublication(
    @Param('_id') _id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ): Promise<{ message: string }> {
    return this.publicationService.updatePublication(_id, updatePublicationDto);
  }

  @Delete('delete/:id')
  async deletePublication(@Param('id') id: string): Promise<{ _id: string }> {
    const publications = await this.publicationService.deletePublication(id);

    if(publications._id) {
      this._logger.log(
        'Publication deleted successfully',
        'PublicationController deletePublication',
        {
          publicationsId: publications._id,
        }
      );
    } else {
      this._logger.error(
        'Publication Error',
        'PublicationController deletePublication',
        {
          publications: publications,
        }
      );
    }

    return publications;
  }
}
