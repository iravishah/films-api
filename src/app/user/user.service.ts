import { Injectable, PreconditionFailedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) { }

    async findOne(username: string): Promise<User> {
        const q = {
            username
        }

        return await this.userModel.findOne(q);
    }

    async create(user: CreateUserDto): Promise<User> {
        user.created_at = user.updated_at = new Date();
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        try {
            return await this.userModel.create(user);
        } catch (e) {
            throw new PreconditionFailedException(e.message);
        }
    }
}