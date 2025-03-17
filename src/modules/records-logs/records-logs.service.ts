// src/records-logs/records-logs.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity } from './entities/records-log.entity';
import { CreateRecordsLogDto } from './dto/create-records-log.dto';

@Injectable()
export class RecordsLogsService {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) {}

  async create(createRecordsLogDto: CreateRecordsLogDto): Promise<LogEntity> {
    const newLog = this.logRepository.create(createRecordsLogDto);
    return this.logRepository.save(newLog);
  }

  findAll(): Promise<LogEntity[]> {
    return this.logRepository.find();
  }

  findOne(_id: string): Promise<LogEntity | null> {
    return this.logRepository.findOneBy({ _id });
  }

  async update(_id: string, updateRecordsLogDto: Partial<CreateRecordsLogDto>): Promise<void> {
    await this.logRepository.update({ _id }, updateRecordsLogDto);
  }

  async remove(_id: string): Promise<void> {
    await this.logRepository.delete({ _id });
  }
}
