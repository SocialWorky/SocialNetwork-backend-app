import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/postMediaFiles.entity';
import { Publication } from '../publications/entities/publications.entity';
import { MediaController } from './postMediaFiles.controller';
import { MediaService } from './postMediaFiles.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Media, Publication]), AuthModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [TypeOrmModule],
})
export class MediaModule {}
