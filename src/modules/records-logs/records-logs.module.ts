// src/records-logs/records-logs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './entities/records-log.entity';
import { RecordsLogsController } from './records-logs.controller';
import { RecordsLogsService } from './records-logs.service';
import { AppLogger } from './logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity])],
  controllers: [RecordsLogsController],
  providers: [RecordsLogsService, AppLogger],
  exports: [RecordsLogsService, AppLogger],
})
export class RecordsLogsModule {}
