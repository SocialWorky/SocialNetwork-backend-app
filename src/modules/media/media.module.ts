import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Publication } from '../publications/entities/publications.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Media, Publication]), AuthModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [TypeOrmModule],
})
export class MediaModule {}
