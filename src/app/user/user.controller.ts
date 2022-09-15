import { Body, Controller, Put, Post, UseGuards, Param, Get, Delete } from "@nestjs/common";
import { JwtAuthGuard } from "../../framework/auth/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./schemas/user.schema";
import { UserService } from "./user.service";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }
    /**
     *
     *
     * @param {CreateUserDto} body
     * @return {*}  {Promise<User>}
     * @memberof UserController
     */
    @Post()
    async create(@Body() body: CreateUserDto): Promise<User> {
        return await this.userService.create(body);
    }
    /**
     *
     *
     * @param {string} id
     * @param {UpdateUserDto} body
     * @return {*}  {Promise<User>}
     * @memberof UserController
     */
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateUserDto): Promise<User> {
        return await this.userService.update(id, body);
    }
    /**
     *
     *
     * @param {string} id
     * @return {*}  {Promise<User>}
     * @memberof UserController
     */
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async get(@Param('id') id: string): Promise<User> {
        return await this.userService.get(id);
    }
    /**
     *
     *
     * @return {*}  {Promise<Array<User>>}
     * @memberof UserController
     */
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(): Promise<Array<User>> {
        return await this.userService.getAll();
    }
    /**
     *
     *
     * @param {string} id
     * @return {*}  {Promise<any>}
     * @memberof UserController
     */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any> {
        return await this.userService.delete(id);
    }
}