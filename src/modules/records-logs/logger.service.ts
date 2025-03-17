// src/logger/logger.service.ts
import { Injectable } from '@nestjs/common';
import { RecordsLogsService } from '../records-logs/records-logs.service';
import { LevelLogEnum } from '../records-logs/enums/records-logs.enum';

@Injectable()
export class AppLogger {
  constructor(private readonly recordsLogsService: RecordsLogsService) {}

  log(message: string, context?: string, metadata?: Record<string, any>) {
    this.saveLog(LevelLogEnum.INFO, message, context, metadata);
  }

  warn(message: string, context?: string, metadata?: Record<string, any>) {
    this.saveLog(LevelLogEnum.WARN, message, context, metadata);
  }

  error(message: string, context?: string, metadata?: Record<string, any>) {
    this.saveLog(LevelLogEnum.ERROR, message, context, metadata);
  }

  debug(message: string, context?: string, metadata?: Record<string, any>) {
    this.saveLog(LevelLogEnum.DEBUG, message, context, metadata);
  }

  private saveLog(level: LevelLogEnum, message: string, context?: string, metadata?: Record<string, any>) {
    const logData = {
      level,
      context: context || 'Global',
      message,
      metadata: metadata || {},
    };

    this.recordsLogsService.create(logData).catch((error) => {
      console.error('Error saving log:', error);
    });
  }
}
