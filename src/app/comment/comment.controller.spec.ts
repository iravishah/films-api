import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import MongoMemoryServer from "mongodb-memory-server-core";

import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { CommentSchema } from "./schemas/comment.schema";

describe('Comment Controller', () => {
    let mongod = null;
    let controller: CommentController;
    let service: CommentService;

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
                const resp: any = {
                    "film_id": "6322165493db4ed7b52e2aca",
                    "comment": "This is a comment",
                    "user_id": "bd1053b6ca-6290-4cc3-800d-9d6edf9ca180",
                    "created_at": "2022-09-15T08:31:21.413Z",
                    "updated_at": "2022-09-15T08:31:21.413Z",
                    "id": "flmcefe27d9-169a-432b-ba56-f7d33a65d171"
                }

                const request: any = {
                    user: {
                        id: '123'
                    }
                }

                const createComment: any = {
                    film_id: '6322165493db4ed7b52e2aca',
                    comment: 'This is a comment'
                }

                jest.spyOn(service, 'create').mockImplementationOnce(() => Promise.resolve(resp));

                const data = await controller.create(request, createComment);
                expect(data).toBeTruthy();
                expect(Object.keys(data)).toEqual(['film_id', 'comment', 'user_id', 'created_at', 'updated_at', 'id']);
            });
        });
    });

    describe('Update Comment', () => {
        describe('Success scenario', () => {
            it('should update the commnet', async () => {
                const resp: any = {
                    "film_id": "6322165493db4ed7b52e2aca",
                    "comment": "This is a new comment",
                    "user_id": "bd1053b6ca-6290-4cc3-800d-9d6edf9ca180",
                    "created_at": "2022-09-15T08:31:21.413Z",
                    "updated_at": "2022-09-15T08:31:21.413Z",
                    "id": "flmcefe27d9-169a-432b-ba56-f7d33a65d171"
                }

                const request: any = {
                    user: {
                        id: '123'
                    }
                }

                const updateComment: any = {
                    film_id: '6322165493db4ed7b52e2aca',
                    comment: 'This is a new comment'
                }

                jest.spyOn(service, 'update').mockImplementationOnce(() => Promise.resolve(resp));

                const data = await controller.update(resp.id, request, updateComment);
                expect(data).toBeTruthy();
                expect(data.comment).toEqual('This is a new comment');
                expect(Object.keys(data)).toEqual(['film_id', 'comment', 'user_id', 'created_at', 'updated_at', 'id']);
            });
        });
    });

    describe('Get All Comments', () => {
        describe('Success scenario', () => {
            it('should get all the comments', async () => {
                const resp: any = [{
                    "film_id": "6322165493db4ed7b52e2aca",
                    "comment": "This is a new comment",
                    "user_id": "bd1053b6ca-6290-4cc3-800d-9d6edf9ca180",
                    "created_at": "2022-09-15T08:31:21.413Z",
                    "updated_at": "2022-09-15T08:31:21.413Z",
                    "id": "flmcefe27d9-169a-432b-ba56-f7d33a65d171"
                }];

                jest.spyOn(service, 'getAll').mockImplementationOnce(() => Promise.resolve(resp));

                const data = await controller.getAll();
                expect(data).toBeTruthy();
                expect(data).toHaveLength(1);
            });
        });
    });

    describe('Get Comment', () => {
        describe('Success scenario', () => {
            it('should get the comment', async () => {
                const resp: any = {
                    "film_id": "6322165493db4ed7b52e2aca",
                    "comment": "This is a new comment",
                    "user_id": "bd1053b6ca-6290-4cc3-800d-9d6edf9ca180",
                    "created_at": "2022-09-15T08:31:21.413Z",
                    "updated_at": "2022-09-15T08:31:21.413Z",
                    "id": "flmcefe27d9-169a-432b-ba56-f7d33a65d171"
                };

                jest.spyOn(service, 'get').mockImplementationOnce(() => Promise.resolve(resp));

                const data = await controller.get(resp.id);
                expect(data).toBeTruthy();
                expect(Object.keys(data)).toEqual(['film_id', 'comment', 'user_id', 'created_at', 'updated_at', 'id']);
            });
        });
    });

    describe('Delete Comment', () => {
        describe('Success scenario', () => {
            it('should delete the comment', async () => {
                const resp: any = {
                    "acknowledged": true,
                    "deletedCount": 1
                };

                jest.spyOn(service, 'delete').mockImplementationOnce(() => Promise.resolve(resp));

                const data = await controller.delete(resp.id);
                expect(data).toBeTruthy();
                expect(data.deletedCount).toBe(1);
                expect(Object.keys(data)).toEqual(['acknowledged', 'deletedCount']);
            });
        });
    });
});