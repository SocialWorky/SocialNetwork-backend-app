import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Social Network Application')
    .setDescription(
      "This is a social networking application that adapts to the customer's needs.",
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Social Network API',
    customCssUrl: '../assets/swagger/topbar.css',
    // customfavIcon: 'assets/swagger/favicon.ico',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      layout: 'BaseLayout',
    },
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
