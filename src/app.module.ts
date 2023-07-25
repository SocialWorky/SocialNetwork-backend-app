import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

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
      synchronize: true, // Solo utilizar synchronize en desarrollo (crea automáticamente las tablas, no en producción)
    }),
    UsersModule,
    AuthModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
