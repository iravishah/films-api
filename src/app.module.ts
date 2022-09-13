import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { loadConfig } from './framework/module.options';

@Module({
  imports: [
    ConfigModule.forRoot(loadConfig()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
