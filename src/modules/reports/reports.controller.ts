import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportStatus } from 'src/common/enums/status.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Auth(Role.USER)
  @ApiBearerAuth()
  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.reportsService.findOne(_id);
  }

  @Auth(Role.USER)
  @ApiBearerAuth()
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(_id, updateReportDto);
  }

  @Auth(Role.ADMIN)
  @ApiBearerAuth()
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.reportsService.remove(_id);
  }

  @Auth(Role.USER)
  @ApiBearerAuth()
  @Get('status/:status')
  findReportStatus(@Param('status') status: ReportStatus) {
    return this.reportsService.findReportStatus(status);
  }
}
