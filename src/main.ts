import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './framework/logger/logger.service';

async function bootstrap() {
  const logger = new LoggerService();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks(['SIGTERM', 'SIGINT', 'SIGHUP', 'uncaughtException', 'unhandledRejection']);

  logger.log({
    message: 'Started Films API',
    port: process.env.PORT
  });
  
  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
