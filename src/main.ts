import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './framework/logger/logger.service';

async function bootstrap() {
  const logger = new LoggerService();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks(['SIGTERM', 'SIGINT', 'SIGHUP', 'uncaughtException', 'unhandledRejection']);

  const config = new DocumentBuilder()
    .setTitle('Films API')
    .setDescription('This is a swagger of Films API which allows to CRUD operations for Films, Users and Comments')
    .setVersion('1.0')
    .addTag('films')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  logger.log({
    message: 'Started Films API',
    port: process.env.PORT
  });

  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
