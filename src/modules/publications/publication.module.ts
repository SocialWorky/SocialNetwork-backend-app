import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publication } from '../../entities/publications.entity';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { AuthModule } from '../../auth/auth.module';
import { AuthController } from 'src/auth/auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Publication]), AuthModule],
  controllers: [PublicationController],
  providers: [PublicationService, AuthController],
})
export class PublicationModule {}
