import { Body, Controller, Put, Post, UseGuards, Param, Get, Delete } from "@nestjs/common";
import { JwtAuthGuard } from "src/framework/auth/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./schemas/user.schema";
import { UserService } from "./user.service";

@Controller('users')
@UseGuards(JwtAuthGuard)
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
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any> {
        return await this.userService.delete(id);
    }
}