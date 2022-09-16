import { ExecutionContext, HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import MongoMemoryServer from "mongodb-memory-server-core";
import { MongooseModule } from "@nestjs/mongoose";
import * as request from 'supertest';

import { CommentSchema } from "../src/app/comment/schemas/comment.schema";
import { CommentController } from "../src/app/comment/comment.controller";
import { CommentService } from "../src/app/comment/comment.service";
import { JwtAuthGuard } from "../src/framework/auth/jwt-auth.guard";

describe('Comment E2E Test', () => {
    let app: INestApplication;
    let mongod = null;
    let id = null;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const moduleRef = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => ({
                        uri: await mongod.getUri(),
                    })
                }),
                MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
            ],
            controllers: [CommentController],
            providers: [CommentService]
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: (context: ExecutionContext) => {
                    const req = context.switchToHttp().getRequest();
                    req.user = { id: 123 };
                    return true;
                },
            })
            .compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
        await mongod.stop();
    });

    describe('Comment Create API', () => {
        describe('Success scenario', () => {
            it('should create comment', async () => {
                const comment = {
                    "film_id": "6322165493db4ed7b52e2aca",
                    "comment": "This is a comment"
                }
                return request(app.getHttpServer())
                    .post('/comments')
                    .send(comment)
                    .expect(HttpStatus.CREATED)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        const body = data.body;
                        expect(body).toBeTruthy();
                        expect(Object.keys(body)).toEqual([
                            'film_id',
                            'comment',
                            'user_id',
                            'created_at',
                            'updated_at',
                            '_id',
                            'id',
                            '__v'
                        ]);
                        id = body.id;
                    })
            });
        });
        describe('Failure response', () => {
            it('should return film id is required', async () => {
                const comment = {
                    "comment": "This is a comment"
                }
                const res = {
                    statusCode: 400,
                    message: ['film_id must be a string', 'film_id should not be empty'],
                    error: 'Bad Request'
                }
                return request(app.getHttpServer())
                    .post('/comments')
                    .send(comment)
                    .expect(HttpStatus.BAD_REQUEST)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        expect(data.body).toBeTruthy();
                        expect(data.body).toEqual(res);
                    })
            });
            it('should return comment is required', async () => {
                const comment = {
                    "film_id": "6322165493db4ed7b52e2aca"
                }
                const res = {
                    statusCode: 400,
                    message: ['comment must be a string', 'comment should not be empty'],
                    error: 'Bad Request'
                }
                return request(app.getHttpServer())
                    .post('/comments')
                    .send(comment)
                    .expect(HttpStatus.BAD_REQUEST)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        expect(data.body).toBeTruthy();
                        expect(data.body).toEqual(res);
                    })
            });
        });
    });

    describe('Comment Update API', () => {
        describe('Success scenario', () => {
            it('should update comment', async () => {
                const comment = {
                    "comment": "This is a new comment"
                }
                return request(app.getHttpServer())
                    .put(`/comments/${id}`)
                    .send(comment)
                    .expect(HttpStatus.OK)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        const body = data.body;
                        expect(body).toBeTruthy();
                        expect(body.comment).toEqual('This is a new comment')
                        expect(Object.keys(body)).toEqual([
                            '_id',
                            'film_id',
                            'comment',
                            'user_id',
                            'created_at',
                            'updated_at',
                            'id',
                            '__v'
                        ]);
                    })
            });
        });
    });

    describe('Comment Get API', () => {
        describe('Success scenario', () => {
            it('should get comment', async () => {
                return request(app.getHttpServer())
                    .get(`/comments/${id}`)
                    .expect(HttpStatus.OK)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        const body = data.body;
                        expect(body).toBeTruthy();
                        expect(Object.keys(body)).toEqual([
                            '_id',
                            'film_id',
                            'comment',
                            'user_id',
                            'created_at',
                            'updated_at',
                            'id',
                            '__v'
                        ]);
                    })
            });
        });
    });

    describe('Comment Get All API', () => {
        describe('Success scenario', () => {
            it('should get all comment', async () => {
                return request(app.getHttpServer())
                    .get(`/comments`)
                    .expect(HttpStatus.OK)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        const body = data.body;
                        expect(body).toBeTruthy();
                        expect(body).toHaveLength(1);
                        expect(Object.keys(body[0])).toEqual([
                            '_id',
                            'film_id',
                            'comment',
                            'user_id',
                            'created_at',
                            'updated_at',
                            'id',
                            '__v'
                        ]);
                    })
            });
        });
    });

    describe('Comment Delete API', () => {
        describe('Success scenario', () => {
            it('should delete comment', async () => {
                return request(app.getHttpServer())
                    .delete(`/comments/${id}`)
                    .expect(HttpStatus.OK)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        const body = data.body;
                        expect(body).toBeTruthy();
                        expect(body).toEqual({ acknowledged: true, deletedCount: 1 })
                    })
            });
        });
    });
});