import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { FilmModule } from './app/film/film.module';
import { AuthModule } from './framework/auth/auth.module';
import { loadConfig } from './framework/module.options';
import { MongooseConfigService } from './framework/mongoose-config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService
    }),
    ConfigModule.forRoot(loadConfig()),
    AuthModule,
    FilmModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
