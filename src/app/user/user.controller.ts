import { Body, Controller, Headers, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/framework/auth/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./schemas/user.schema";
import { UserService } from "./user.service";

@Controller('/user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Post()
    async create(@Body() body: CreateUserDto): Promise<User> {
        return await this.userService.create(body);
    }
}