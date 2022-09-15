import { Body, Controller, Param, Post, Put, Get, UseGuards, Delete } from "@nestjs/common";
import { JwtAuthGuard } from "src/framework/auth/jwt-auth.guard";
import { CreateFilmDto } from "./dto/create-film.dto";
import { UpdateFilmDto } from "./dto/update-film.dto";
import { FilmService } from "./film.service";
import { Film } from "./schemas/film.schema";

@Controller('films')
@UseGuards(JwtAuthGuard)
export class FilmController {
    constructor(
        private readonly filmService: FilmService
    ) { }
    /**
     *
     *
     * @param {CreateFilmDto} body
     * @return {*}  {Promise<Film>}
     * @memberof FilmController
     */
    @Post()
    async create(@Body() body: CreateFilmDto): Promise<Film> {
        return await this.filmService.create(body);
    }
    /**
     *
     *
     * @param {string} id
     * @param {UpdateFilmDto} body
     * @return {*}  {Promise<Film>}
     * @memberof FilmController
     */
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateFilmDto): Promise<Film> {
        return await this.filmService.update(id, body);
    }
    /**
     *
     *
     * @param {string} id
     * @return {*}  {Promise<Film>}
     * @memberof FilmController
     */
    @Get(':id')
    async get(@Param('id') id: string): Promise<Film> {
        return await this.filmService.get(id);
    }
    /**
     *
     *
     * @return {*}  {Promise<Array<Film>>}
     * @memberof FilmController
     */
    @Get()
    async getAll(): Promise<Array<Film>> {
        return await this.filmService.getAll();
    }
    /**
     *
     *
     * @param {string} id
     * @return {*}  {Promise<any>}
     * @memberof FilmController
     */
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any> {
        return await this.filmService.delete(id);
    }
}