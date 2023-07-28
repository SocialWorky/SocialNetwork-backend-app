import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from '../../entities/user.entity';
import { Publication } from '../../entities/publications.entity';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publication, User]),
    AuthModule,
    UsersModule,
  ],
  controllers: [PublicationController],
  providers: [PublicationService],
})
export class PublicationModule {}
