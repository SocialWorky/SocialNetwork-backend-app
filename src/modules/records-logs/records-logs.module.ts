import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './entities/records-log.entity';
import { RecordsLogsController } from './records-logs.controller';
import { RecordsLogsService } from './records-logs.service';
import { AppLogger } from './logger.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity]), AuthModule],
  controllers: [RecordsLogsController],
  providers: [RecordsLogsService, AppLogger],
  exports: [RecordsLogsService, AppLogger],
})
export class RecordsLogsModule {}
