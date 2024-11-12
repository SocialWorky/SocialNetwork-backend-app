import { Module } from '@nestjs/common';
import { CustomFieldService } from './custom-field.service';
import { CustomFieldController } from './custom-field.controller';
import { CustomField } from './entities/custom-field.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CustomField]), AuthModule],
  controllers: [CustomFieldController],
  providers: [CustomFieldService],
})
export class CustomFieldModule {}
