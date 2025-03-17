import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecordsLogsService } from './records-logs.service';
import { CreateRecordsLogDto } from './dto/create-records-log.dto';
import { UpdateRecordsLogDto } from './dto/update-records-log.dto';

@Controller('records-logs')
export class RecordsLogsController {
  constructor(private readonly recordsLogsService: RecordsLogsService) {}

  @Post()
  create(@Body() createRecordsLogDto: CreateRecordsLogDto) {
    return this.recordsLogsService.create(createRecordsLogDto);
  }

  @Get()
  findAll() {
    return this.recordsLogsService.findAll();
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
