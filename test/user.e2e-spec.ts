import { ExecutionContext, HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import MongoMemoryServer from "mongodb-memory-server-core";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import * as request from 'supertest';

import { JwtAuthGuard } from "../src/framework/auth/jwt-auth.guard";
import { User, UserSchema } from "../src/app/user/schemas/user.schema";
import { Model } from "mongoose";
import { UserController } from "../src/app/user/user.controller";
import { UserService } from "../src/app/user/user.service";

describe('User E2E Test', () => {
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
                MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
            ],
            controllers: [UserController],
            providers: [UserService]
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

    describe('Create User API', () => {
        describe('Success scenario', () => {
            it('should create user', async () => {
                const user = {
                    "name": "ravi shah",
                    "username": "ravi223",
                    "password": "Vijay@123",
                    "description": "description",
                    "is_reviewer": true
                }
                return request(app.getHttpServer())
                    .post('/users')
                    .send(user)
                    .expect(HttpStatus.CREATED)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        const body = data.body;
                        expect(body).toBeTruthy();
                        expect(Object.keys(body)).toEqual([
                            'name', 'username',
                            'password', 'description',
                            'is_reviewer', 'created_at',
                            'updated_at', '_id',
                            'id', '__v'
                        ])
                        id = body.id;
                    })
            });
        });
        describe('Failure response', () => {
            it('should return name is required', async () => {
                const user = {
                    "username": "ravi223",
                    "password": "Vijay@123",
                    "description": "description",
                    "is_reviewer": true
                }
                const res = {
                    statusCode: 400,
                    message: ['name must be a string', 'name should not be empty'],
                    error: 'Bad Request'
                }
                return request(app.getHttpServer())
                    .post('/users')
                    .send(user)
                    .expect(HttpStatus.BAD_REQUEST)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        expect(data.body).toBeTruthy();
                        expect(data.body).toEqual(res);
                    })
            });
            it('should return erros', async () => {
                const user = {
                }

                const res = {
                    statusCode: 400,
                    message: [
                        'name must be a string',
                        'name should not be empty',
                        'username must be a string',
                        'username should not be empty',
                        'password must be a string',
                        'password should not be empty',
                        'description must be a string',
                        'description should not be empty',
                        'is_reviewer must be a boolean value',
                        'is_reviewer should not be empty'
                    ],
                    error: 'Bad Request'
                }

                return request(app.getHttpServer())
                    .post('/users')
                    .send(user)
                    .expect(HttpStatus.BAD_REQUEST)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        expect(data.body).toBeTruthy();
                        expect(data.body).toEqual(res);
                    })
            });
        });
    });

    describe('Update User API', () => {
        describe('Success scenario', () => {
            it('should update user', async () => {
                const user = {
                    "name": "ravi b shah",
                    "username": "ravi223",
                    "password": "Vijay@123",
                    "description": "description",
                    "is_reviewer": true
                }
                return request(app.getHttpServer())
                    .put(`/users/${id}`)
                    .send(user)
                    .expect(HttpStatus.OK)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        const body = data.body;
                        expect(body).toBeTruthy();
                        expect(Object.keys(body)).toEqual([
                            '_id', 'name', 'username',
                            'password', 'description',
                            'is_reviewer', 'created_at',
                            'updated_at',
                            'id', '__v'
                        ])
                    })
            });
        });
    });

    describe('Get User API', () => {
        describe('Success scenario', () => {
            it('should get user', async () => {
                return request(app.getHttpServer())
                    .get(`/users/${id}`)
                    .expect(HttpStatus.OK)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        const body = data.body;
                        expect(body).toBeTruthy();
                        expect(Object.keys(body)).toEqual([
                            '_id', 'name', 'username',
                            'password', 'description',
                            'is_reviewer', 'created_at',
                            'updated_at',
                            'id', '__v'
                        ])
                    })
            });
        });
    });

    describe('Get All User API', () => {
        describe('Success scenario', () => {
            it('should get users', async () => {
                return request(app.getHttpServer())
                    .get('/users')
                    .expect(HttpStatus.OK)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        const body = data.body;
                        expect(body).toBeTruthy();
                        expect(body).toHaveLength(1);
                        expect(Object.keys(body[0])).toEqual([
                            '_id', 'name', 'username',
                            'password', 'description',
                            'is_reviewer', 'created_at',
                            'updated_at',
                            'id', '__v'
                        ])
                    })
            });
        });
    });

    describe('Delete User API', () => {
        describe('Success scenario', () => {
            it('should delete user', async () => {
                return request(app.getHttpServer())
                    .delete(`/users/${id}`)
                    .expect(HttpStatus.OK)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        const body = data.body;
                        expect(body).toBeTruthy();
                        expect(body).toEqual({ acknowledged: true, deletedCount: 1 });
                    })
            });
        });
    });

    // describe('Update Film API', () => {
    //     describe('Success scenario', () => {
    //         it('should update film', async () => {
    //             const film = {
    //                 "name": "Avengers Retruns",
    //                 "reviewer_id": userObj._id
    //             }
    //             return request(app.getHttpServer())
    //                 .put(`/films/${id}`)
    //                 .send(film)
    //                 .expect(HttpStatus.OK)
    //                 .expect('Content-Type', /json/)
    //                 .then((data) => {
    //                     const body = data.body;
    //                     expect(body).toBeTruthy();
    //                     expect(body.name).toEqual('Avengers Retruns');
    //                     expect(Object.keys(body)).toEqual([
    //                         '_id', 'name', 'description',
    //                         'release_date', 'rating',
    //                         'review', 'country',
    //                         'genres', 'photo',
    //                         'reviewer_id', 'created_at',
    //                         'updated_at',
    //                         'id', '__v'
    //                     ])
    //                 })
    //         });
    //     });

    //     describe('Failure response', () => {
    //         it('should return pre condition failed', async () => {
    //             const film = {
    //                 "name": "Avengers returns",
    //                 "reviewer_id": '123345'
    //             }
    //             const res = {
    //                 statusCode: 412,
    //                 message: 'Cast to ObjectId failed for value "123345" (type string) at path "_id" for model "User"',
    //                 error: 'Precondition Failed'
    //             }
    //             return request(app.getHttpServer())
    //                 .put(`/films/${id}`)
    //                 .send(film)
    //                 .expect(HttpStatus.PRECONDITION_FAILED)
    //                 .expect('Content-Type', /json/)
    //                 .then((data) => {
    //                     expect(data.body).toBeTruthy();
    //                     expect(data.body).toEqual(res);
    //                 })
    //         });
    //     });
    // });

    // describe('Get Film API', () => {
    //     describe('Success scenario', () => {
    //         it('should get film', async () => {
    //             return request(app.getHttpServer())
    //                 .get(`/films/${id}`)
    //                 .expect(HttpStatus.OK)
    //                 .expect('Content-Type', /json/)
    //                 .then((data) => {
    //                     const body = data.body;
    //                     expect(body).toBeTruthy();
    //                     expect(Object.keys(body)).toEqual([
    //                         '_id', 'name', 'description',
    //                         'release_date', 'rating',
    //                         'review', 'country',
    //                         'genres', 'photo',
    //                         'reviewer_id', 'created_at',
    //                         'updated_at',
    //                         'id', '__v'
    //                     ])
    //                 })
    //         });
    //     });
    // });

    // describe('Get All Films API', () => {
    //     describe('Success scenario', () => {
    //         it('should get all films', async () => {
    //             return request(app.getHttpServer())
    //                 .get(`/films`)
    //                 .expect(HttpStatus.OK)
    //                 .expect('Content-Type', /json/)
    //                 .then((data) => {
    //                     const body = data.body;
    //                     expect(body).toBeTruthy();
    //                     expect(body).toHaveLength(1);
    //                     expect(Object.keys(body[0])).toEqual([
    //                         '_id', 'name', 'description',
    //                         'release_date', 'rating',
    //                         'review', 'country',
    //                         'genres', 'photo',
    //                         'reviewer_id', 'created_at',
    //                         'updated_at',
    //                         'id', '__v'
    //                     ])
    //                 })
    //         });
    //     });
    // });

    // describe('Delete Film API', () => {
    //     describe('Success scenario', () => {
    //         it('should delete film', async () => {
    //             return request(app.getHttpServer())
    //                 .delete(`/films/${id}`)
    //                 .expect(HttpStatus.OK)
    //                 .expect('Content-Type', /json/)
    //                 .then((data) => {
    //                     const body = data.body;
    //                     expect(body).toBeTruthy();
    //                     expect(body).toEqual({ acknowledged: true, deletedCount: 1 });
    //                 })
    //         });
    //     });
    // });
});