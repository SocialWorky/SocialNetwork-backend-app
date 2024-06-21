import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportStatus } from 'src/common/enums/status.enum';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  async create(createReportDto: CreateReportDto) {
    const report = this.reportRepository.create(createReportDto);
    return await this.reportRepository.save(report);
  }

  findAll() {
    return this.reportRepository.find();
  }

  findOne(_id: string) {
    return this.reportRepository.findOne({ where: { _id } });
  }

  async update(_id: string, updateReportDto: UpdateReportDto) {
    const report = await this.reportRepository.findOne({ where: { _id } });

    if (!report) {
      return null;
    }

    Object.assign(report, updateReportDto);
    return await this.reportRepository.save(report);
  }

  remove(_id: string) {
    return `This action removes a #${_id} report`;
  }

  findReportStatus(status: ReportStatus) {
    return this.reportRepository.find({ where: { status } });
  }
}
