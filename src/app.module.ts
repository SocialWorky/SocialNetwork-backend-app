require('dotenv').config();
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { JwtExpiredFilter } from './filters/jwt-expired.filter';
import { JwtExceptionFilter } from './filters/jwt-exception.filter';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TagsUsersModule } from './modules/tagsUsers/tagsUsers.module';
import { ReactionModule } from './modules/reaction/reaction.module';
import { PublicationModule } from './modules/publications/publication.module';
import { MediaModule } from './modules/postMediaFiles/postMediaFiles.module';
import { CustomReactionModule } from './modules/customReaction/customReaction.module';
import { CommentModule } from './modules/comment/comment.module';
import { MailsModule } from './modules/mails/mails.module';
import { FriendsModule } from './modules/friends/friends.module';
import { ConfigModule } from './modules/config/config.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { ReportsModule } from './modules/reports/reports.module';
import { CustomFieldModule } from './modules/custom-field/custom-field.module';
import { InvitationCodeModule } from './modules/invitationCode/invitation-code.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import * as cors from 'cors';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.ts,.js}'],
      migrationsRun: true,
      keepConnectionAlive: true,
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.DB_SSL === 'true',
      extra: {
        ssl:
          process.env.DB_SSL === 'true'
            ? {
                rejectUnauthorized: false,
              }
            : null,
      },
    }),
    AuthModule,
    UsersModule,
    TagsUsersModule,
    ReactionModule,
    PublicationModule,
    MediaModule,
    CustomReactionModule,
    CommentModule,
    MailsModule,
    FriendsModule,
    ConfigModule,
    ScraperModule,
    ReportsModule,
    CustomFieldModule,
    InvitationCodeModule,
    WebhookModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}
