import { Injectable, NotFoundException, PreconditionFailedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserDocument } from "./schemas/user.schema";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>
    ) { }
    /**
     *
     *
     * @param {string} username
     * @return {*}  {Promise<User>}
     * @memberof UserService
     */
    async findOne(username: string): Promise<User> {
        const q = {
            username
        }

        return await this.userModel.findOne(q);
    }
    /**
     *
     *
     * @param {CreateUserDto} user
     * @return {*}  {Promise<User>}
     * @memberof UserService
     */
    async create(user: CreateUserDto): Promise<User> {
        user.created_at = user.updated_at = new Date();
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        return await this.userModel.create(user);
    }
    /**
     *
     *
     * @param {string} id
     * @param {UpdateUserDto} user
     * @return {*}  {Promise<User>}
     * @memberof UserService
     */
    async update(id: string, user: UpdateUserDto): Promise<User> {
        user.updated_at = new Date();
        const q = {
            id
        }

        const options = {
            new: true
        }

        return this.userModel.findOneAndUpdate(q, user, options);
    }
    /**
     *
     *
     * @return {*}  {Promise<Array<User>>}
     * @memberof UserService
     */
    async getAll(): Promise<Array<User>> {
        return await this.userModel.find();
    }
    /**
     *
     *
     * @param {*} id
     * @return {*}  {Promise<User>}
     * @memberof UserService
     */
    async get(id: string): Promise<User> {
        const user: User = await this.userModel.findOne({ id });
        if (!user) {
            throw new NotFoundException('User not found!');
        }
        return user;
    }
    /**
     *
     *
     * @param {*} id
     * @return {*}  {Promise<any>}
     * @memberof UserService
     */
    async delete(id: string): Promise<any> {
        return await this.userModel.deleteOne({ id });
    }
    /**
     *
     *
     * @param {string} id
     * @return {*}  {Promise<User>}
     * @memberof UserService
     */
    async fetchUserById(id: string): Promise<User> {
        return await this.userModel.findById(id);
    }
}