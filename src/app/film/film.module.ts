import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Film, FilmSchema } from "./schemas/film.schema";
import { FilmController } from "./film.controller";
import { FilmService } from "./film.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Film.name,
            schema: FilmSchema
        }]),
        UserModule
    ],
    controllers: [FilmController],
    providers: [FilmService],
    exports: []
})

export class FilmModule { }