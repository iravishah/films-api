import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

import { User } from "../../app/user/schemas/user.schema";
import { UserService } from "../../app/user/user.service";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(user: string, pass: string): Promise<User> {
        const _user: User = await this.userService.findOne(user);
        if (!_user) {
            return null;
        }
        const isMatch = await bcrypt.compare(pass, _user.password);
        if (_user && isMatch) {
            return _user;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, id: user.id, name: user.name };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}