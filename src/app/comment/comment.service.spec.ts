import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import MongoMemoryServer from "mongodb-memory-server-core";

import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { CommentSchema } from "./schemas/comment.schema";

describe('Comment Service', () => {
    let mongod = null;
    let controller: CommentController;
    let service: CommentService;
    let id = null;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => ({
                        uri: await mongod.getUri()
                    })
                }),
                MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }])
            ],
            controllers: [CommentController],
            providers: [CommentService],

        }).compile()

        controller = module.get<CommentController>(CommentController);
        service = module.get<CommentService>(CommentService);
    });

    afterAll(async () => {
        await mongod.stop();
    });

    describe('Create Comment', () => {
        describe('Success scenario', () => {
            it('should create comment', async () => {
                const request: any = {
                    user: {
                        id: '123'
                    }
                }

                const createComment: any = {
                    film_id: '6322165493db4ed7b52e2aca',
                    comment: 'This is a comment'
                }

                let data = await service.create(request, createComment);
                data = JSON.parse(JSON.stringify(data));
                expect(data).toBeTruthy();
                expect(Object.keys(data)).toEqual(['film_id', 'comment', 'user_id', 'created_at', 'updated_at', '_id', 'id', '__v']);
                id = data.id;
            });
        });
    });

    describe('Update Comment', () => {
        describe('Success scenario', () => {
            it('should update the commnet', async () => {
                const request: any = {
                    user: {
                        id: '123'
                    }
                }

                const updateComment: any = {
                    comment: 'This is a latest comment'
                }

                let data = await service.update(id, request, updateComment);
                data = JSON.parse(JSON.stringify(data));
                expect(data).toBeTruthy();
                expect(data.comment).toEqual('This is a latest comment');
                expect(Object.keys(data)).toEqual(['_id', 'film_id', 'comment', 'user_id', 'created_at', 'updated_at', 'id', '__v']);
            });
        });
    });

    describe('Get All Comments', () => {
        describe('Success scenario', () => {
            it('should get all the comments', async () => {
                const data = await service.getAll();
                expect(data).toBeTruthy();
                expect(data).toHaveLength(1);
            });
        });
    });

    describe('Get Comment', () => {
        describe('Success scenario', () => {
            it('should get the comment', async () => {
                let data = await controller.get(id);
                data = JSON.parse(JSON.stringify(data));
                expect(data).toBeTruthy();
                expect(Object.keys(data)).toEqual(['_id', 'film_id', 'comment', 'user_id', 'created_at', 'updated_at', 'id', '__v']);
            });
        });
        describe('Failure scenario', () => {
            it('should return comment not found', async () => {
                try {
                    await controller.get('dummy_id');
                } catch (e) {
                    expect(e).toBeTruthy();
                    expect(e.message).toBe('Comment not found!');
                }
            });
        });
    });

    describe('Delete Comment', () => {
        describe('Success scenario', () => {
            it('should delete the comment', async () => {
                const data = await controller.delete(id);
                expect(data).toBeTruthy();
                expect(data.deletedCount).toBe(1);
                expect(Object.keys(data)).toEqual(['acknowledged', 'deletedCount']);
            });
        });
    });
});