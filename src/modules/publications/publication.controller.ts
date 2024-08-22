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

@ApiTags('Publications')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Auth(Role.USER)
@Controller('publications')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post('create')
  async createPublication(
    @Body() createPublicationDto: CreatePublicationDto,
  ): Promise<{ message: string; publications: any }> {
    return this.publicationService.createPublication(createPublicationDto);
  }

  @Get('all')
  async getAllPublications(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('type') type?: string,
    @Query('consultId') consultId?: string,
    @Req() request?: Request,
  ): Promise<Publication[]> {
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
  async getPublicationById(@Param('_id') _id: string): Promise<Publication[]> {
    return this.publicationService.getPublicationById(_id);
  }

  @Put('edit/:_id')
  async updatePublication(
    @Param('_id') _id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ): Promise<{ message: string }> {
    return this.publicationService.updatePublication(_id, updatePublicationDto);
  }

  @Delete('delete/:id')
  async deletePublication(@Param('id') id: string): Promise<void> {
    return this.publicationService.deletePublication(id);
  }
}
