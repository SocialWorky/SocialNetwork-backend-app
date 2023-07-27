import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '../../entities/media.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { AuthModule } from '../../auth/auth.module';
import { AuthController } from 'src/auth/auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Media]), AuthModule],
  controllers: [MediaController],
  providers: [MediaService, AuthController],
})
export class MediaModule {}
