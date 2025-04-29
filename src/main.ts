import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);

  const corsOrigins = process.env.CORS_ORIGINS.split(',');

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Worky Social Network Application')
    .setDescription(
      "This is a social networking application that adapts to the customer's needs.",
    )
    .setVersion('v1.0.0')
    .addBearerAuth()
    .build();
  const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) => {
        return `${controllerKey}_${methodKey}`;
      },
  };

  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('doc', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      layout: 'BaseLayout',
    },
  });

  await app.listen(parseInt(process.env.APP_PORT) || 3000);
  logger.log(`Application is running on port: ${process.env.APP_PORT}`);
}
bootstrap();
