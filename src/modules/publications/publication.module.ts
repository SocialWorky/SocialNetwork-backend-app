import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { MediaModule } from '../media/media.module';
import { MediaService } from '../media/media.service';
import { Publication } from './entities/publications.entity';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publication]),
    AuthModule,
    UsersModule,
    MediaModule,
  ],
  controllers: [PublicationController],
  providers: [PublicationService, UsersService, MediaService],
  exports: [TypeOrmModule],
})
export class PublicationModule {}
