import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { loadConfig } from './framework/module.options';
import { MongooseConfigService } from './framework/mongoose-config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService
    }),
    ConfigModule.forRoot(loadConfig()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
