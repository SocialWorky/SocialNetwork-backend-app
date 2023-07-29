import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { JwtExpiredFilter } from './filters/jwt-expired.filter';
import { JwtExceptionFilter } from './filters/jwt-exception.filter';
import { UsersModule } from './modules/users/users.module';
import { TagsUsersModule } from './modules/tagsUsers/tagsUsers.module';
import { ReactionModule } from './modules/reaction/reaction.module';
import { PublicationModule } from './modules/publications/publication.module';
import { MediaModule } from './modules/media/media.module';
import { CustomReactionModule } from './modules/customReaction/customReaction.module';
import { CommentModule } from './modules/comment/comment.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '192.168.100.33',
      port: 3306,
      username: 'losbar',
      password: 'Losbar191184@',
      database: 'bside',
      autoLoadEntities: true,
      synchronize: true, //Only use synchronize in development (automatically creates tables), not in production.
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src/assets'),
      serveRoot: '/assets',
    }),
    UsersModule,
    TagsUsersModule,
    ReactionModule,
    PublicationModule,
    MediaModule,
    CustomReactionModule,
    CommentModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: JwtExpiredFilter,
    },
    {
      provide: APP_FILTER,
      useClass: JwtExceptionFilter,
    },
  ],
})
export class AppModule {}
