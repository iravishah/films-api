import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment, CommentDocument } from "./schemas/comment.schema";

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>
    ) { }
    /**
     *
     *
     * @param {CreateCommentDto} comment
     * @return {*}  {Promise<Comment>}
     * @memberof CommentService
     */
    async create(req: Request, comment: CreateCommentDto): Promise<Comment> {
        //@ts-ignore
        comment.user_id = req.user.id;
        comment.created_at = comment.updated_at = new Date();

        return await this.commentModel.create(comment);
    }
    /**
     *
     *
     * @param {string} id
     * @param {UpdateCommentDto} comment
     * @return {*}  {Promise<Comment>}
     * @memberof CommentService
     */
    async update(id: string, req: Request, comment: UpdateCommentDto): Promise<Comment> {
        //@ts-ignore
        comment.user_id = req.user.id;
        comment.updated_at = new Date();
        const q = { id };
        const options = { new: true };

        return await this.commentModel.findOneAndUpdate(q, comment, options);
    }
    /**
     *
     *
     * @return {*}  {Promise<Array<Comment>>}
     * @memberof CommentService
     */
    async getAll(): Promise<Array<Comment>> {
        return await this.commentModel.find();
    }
    /**
     *
     *
     * @param {string} id
     * @return {*}  {Promise<Comment>}
     * @memberof CommentService
     */
    async get(id: string): Promise<Comment> {
        return await this.commentModel.findOne({ id });
    }
    /**
     *
     *
     * @param {string} id
     * @return {*}  {Promise<any>}
     * @memberof CommentService
     */
    async delete(id: string): Promise<any> {
        return await this.commentModel.deleteOne({ id });
    }
}