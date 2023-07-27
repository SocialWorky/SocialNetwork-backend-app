import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { JwtExpiredFilter } from './filters/jwt-expired.filter';
import { JwtExceptionFilter } from './filters/jwt-exception.filter';
import { UsersModule } from './modules/users/users.module';
import { TagsUsersModule } from './modules/tagsUsers/tagsUsers.module';
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
    UsersModule,
    TagsUsersModule,
    AuthModule,
  ],
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
