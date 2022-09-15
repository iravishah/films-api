import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "src/framework/auth/jwt-auth.guard";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment } from './schemas/comment.schema';
@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post()
    async create(@Request() req: Request, @Body() body: CreateCommentDto): Promise<Comment> {
        return await this.commentService.create(req, body);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Request() req: Request, @Body() body: UpdateCommentDto): Promise<Comment> {
        return await this.commentService.update(id, req, body);
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<Comment> {
        return await this.commentService.get(id);
    }

    @Get()
    async getAll(): Promise<Array<Comment>> {
        return await this.commentService.getAll();
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any> {
        return await this.commentService.delete(id);
    }
}