import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { RecordsLogsService } from './records-logs.service';
import { CreateManyRecordsLogDto, CreateRecordsLogDto } from './dto/create-records-log.dto';
import { UpdateRecordsLogDto } from './dto/update-records-log.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Role } from '../../common/enums/rol.enum';
import { AuthGuard } from '../../auth/guard/auth.guard';

@ApiTags('Logs')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Auth(Role.ADMIN)
@Controller('records-logs')
export class RecordsLogsController {
  constructor(private readonly recordsLogsService: RecordsLogsService) {}

  @Post()
  create(@Body() createRecordsLogDto: CreateRecordsLogDto) {
    return this.recordsLogsService.create(createRecordsLogDto);
  }

  @Post('batch')
  async createMany(@Body() createManyRecordsLogDto: CreateManyRecordsLogDto) {
    return this.recordsLogsService.createMany(createManyRecordsLogDto);
  }

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.recordsLogsService.findAll(page, limit);
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.recordsLogsService.findOne(_id);
  }

  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateRecordsLogDto: UpdateRecordsLogDto) {
    return this.recordsLogsService.update(_id, updateRecordsLogDto);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.recordsLogsService.remove(_id);
  }
}
