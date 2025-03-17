import { PartialType } from '@nestjs/swagger';
import { CreateRecordsLogDto } from './create-records-log.dto';

export class UpdateRecordsLogDto extends PartialType(CreateRecordsLogDto) {}
