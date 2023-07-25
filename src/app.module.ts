import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { JwtExpiredFilter } from './filters/jwt-expired.filter';
import { UsersModule } from './users/users.module';
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
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: JwtExpiredFilter,
    },
  ],
})
export class AppModule {}
