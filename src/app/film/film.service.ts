import { Injectable, NotFoundException, PreconditionFailedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../user/schemas/user.schema";
import { UserService } from "../user/user.service";

import { CreateFilmDto } from "./dto/create-film.dto";
import { UpdateFilmDto } from "./dto/update-film.dto";
import { Film, FilmDocument } from "./schemas/film.schema";

@Injectable()
export class FilmService {
    constructor(
        @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
        private readonly userService: UserService
    ) { }
    /**
     *
     *
     * @param {CreateFilmDto} film
     * @return {*}  {Promise<Film>}
     * @memberof FilmService
     */
    async create(film: CreateFilmDto): Promise<Film> {
        film.created_at = film.updated_at = new Date();

        try {
            await this.isUserReviewer(film);
        } catch (e) {
            throw new PreconditionFailedException(e.message);
        }
        console.log('create film');
        return await this.filmModel.create(film);
    }
    /**
     *
     *
     * @param {string} id
     * @param {UpdateFilmDto} film
     * @return {*}  {Promise<Film>}
     * @memberof FilmService
     */
    async update(id: string, film: UpdateFilmDto): Promise<Film> {
        film.updated_at = new Date();

        try {
            await this.isUserReviewer(film);
        } catch (e) {
            throw new PreconditionFailedException(e.message);
        }

        const q = {
            id
        };
        const options = {
            new: true
        }
        return await this.filmModel.findOneAndUpdate(q, film, options);
    }
    /**
     *
     *
     * @param {string} id
     * @return {*}  {Promise<Film>}
     * @memberof FilmService
     */
    async get(id: string): Promise<Film> {
        const film: Film = await this.filmModel.findOne({ id });
        if (!film) {
            throw new NotFoundException('Film not found!');
        }
        return film;
    }
    /**
     *
     *
     * @return {*}  {Promise<Array<Film>>}
     * @memberof FilmService
     */
    async getAll(): Promise<Array<Film>> {
        return await this.filmModel.find();
    }
    /**
     *
     *
     * @param {string} id
     * @return {*}  {Promise<any>}
     * @memberof FilmService
     */
    async delete(id: string): Promise<any> {
        return await this.filmModel.deleteOne({ id });
    }
    /**
     *
     *
     * @param {*} film
     * @return {*}  {Promise<User>}
     * @memberof FilmService
     */
    async isUserReviewer(film): Promise<User> {
        const user = await this.userService.fetchUserById(film.reviewer_id);

        if (!user) {
            throw new PreconditionFailedException('User not found!');
        }

        if (!user.is_reviewer) {
            throw new PreconditionFailedException('You have to be reviewer to post the review');
        }
        return user;
    }
}