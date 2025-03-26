import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntity } from './entities/records-log.entity';
import { CreateManyRecordsLogDto, CreateRecordsLogDto } from './dto/create-records-log.dto';

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

  async createMany(createManyRecordsLogDto: CreateManyRecordsLogDto): Promise<LogEntity[]> {
    const logsToSave = createManyRecordsLogDto.logs.map((logDto) =>
      this.logRepository.create({
        level: logDto.level,
        context: logDto.context,
        message: logDto.message,
        metadata: logDto.metadata || null,
        timestamp: logDto.timestamp || new Date(),
      }),
    );

    try {
      return await this.logRepository.save(logsToSave);
    } catch (error) {
      console.error('Error al guardar logs:', error);
      throw new Error('Error al procesar los logs');
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ logs: LogEntity[]; total: number }> {
    const logs = await this.logRepository.find({
      order: { timestamp: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await this.logRepository.count();

    return { logs, total };
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
