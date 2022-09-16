import { ExecutionContext, HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import MongoMemoryServer from "mongodb-memory-server-core";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import * as request from 'supertest';

import { JwtAuthGuard } from "../src/framework/auth/jwt-auth.guard";
import { FilmSchema } from "../src/app/film/schemas/film.schema";
import { FilmController } from "../src/app/film/film.controller";
import { FilmService } from "../src/app/film/film.service";
import { UserModule } from "../src/app/user/user.module";
import { User, UserSchema } from "../src/app/user/schemas/user.schema";
import { Model } from "mongoose";

describe('Film E2E Test', () => {
    let app: INestApplication;
    let mongod = null;
    let id = null;
    let user: Model<User>;
    let userObj = null;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const moduleRef = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => ({
                        uri: await mongod.getUri(),
                    })
                }),
                MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }, { name: 'User', schema: UserSchema }]),
                UserModule
            ],
            controllers: [FilmController],
            providers: [FilmService]
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

        user = moduleRef.get<Model<User>>(getModelToken('User'));
        userObj = await user.create({
            "name": "ravi shah",
            "username": "ravi223",
            "password": "Vijay@123",
            "description": "description",
            "is_reviewer": true,
            "created_at": new Date(),
            "updated_at": new Date()
        });

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
        await mongod.stop();
    });

    describe('Create Film API', () => {
        describe('Success scenario', () => {
            it('should create film', async () => {
                const film = {
                    "name": "Avengers",
                    "description": "Super power",
                    "release_date": "23/02/2022",
                    "rating": 5,
                    "review": "Its a awsome movie!",
                    "country": "US",
                    "genres": ["action"],
                    "photo": "https://google.com/avengers",
                    "reviewer_id": userObj._id
                }
                return request(app.getHttpServer())
                    .post('/films')
                    .send(film)
                    .expect(HttpStatus.CREATED)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        const body = data.body;
                        expect(body).toBeTruthy();
                        expect(Object.keys(body)).toEqual([
                            'name', 'description',
                            'release_date', 'rating',
                            'review', 'country',
                            'genres', 'photo',
                            'reviewer_id', 'created_at',
                            'updated_at', '_id',
                            'id', '__v'
                        ])
                        id = body.id;
                    })
            });
        });
        describe('Failure response', () => {
            it('should return pre condition failed', async () => {
                const film = {
                    "name": "Avengers",
                    "description": "Super power",
                    "release_date": "23/02/2022",
                    "rating": 5,
                    "review": "Its a awsome movie!",
                    "country": "US",
                    "genres": ["action"],
                    "photo": "https://google.com/avengers",
                    "reviewer_id": '123345'
                }
                const res = {
                    statusCode: 412,
                    message: 'Cast to ObjectId failed for value "123345" (type string) at path "_id" for model "User"',
                    error: 'Precondition Failed'
                }
                return request(app.getHttpServer())
                    .post('/films')
                    .send(film)
                    .expect(HttpStatus.PRECONDITION_FAILED)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        expect(data.body).toBeTruthy();
                        expect(data.body).toEqual(res);
                    })
            });
            it('should return name is required', async () => {
                const film = {
                    "description": "Super power",
                    "release_date": "23/02/2022",
                    "rating": 5,
                    "review": "Its a awsome movie!",
                    "country": "US",
                    "genres": ["action"],
                    "photo": "https://google.com/avengers",
                    "reviewer_id": userObj._id
                }
                const res = {
                    statusCode: 400,
                    message: ['name must be a string', 'name should not be empty'],
                    error: 'Bad Request'
                }
                return request(app.getHttpServer())
                    .post('/films')
                    .send(film)
                    .expect(HttpStatus.BAD_REQUEST)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        expect(data.body).toBeTruthy();
                        expect(data.body).toEqual(res);
                    })
            });
            it('should return erros', async () => {
                const film = {
                }
                const res = {
                    statusCode: 400,
                    message: [
                        'name must be a string',
                        'name should not be empty',
                        'description must be a string',
                        'description should not be empty',
                        'release_date must be a string',
                        'release_date should not be empty',
                        'rating must not be greater than 5',
                        'rating must be a number conforming to the specified constraints',
                        'rating should not be empty',
                        'review must be a string',
                        'review should not be empty',
                        'country must be a string',
                        'country should not be empty',
                        'genres must contain at least 1 elements',
                        'genres must be an array',
                        'genres should not be empty',
                        'photo must be a string',
                        'photo should not be empty',
                        'reviewer_id must be a string',
                        'reviewer_id should not be empty'
                    ],
                    error: 'Bad Request'
                }
                return request(app.getHttpServer())
                    .post('/films')
                    .send(film)
                    .expect(HttpStatus.BAD_REQUEST)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        expect(data.body).toBeTruthy();
                        expect(data.body).toEqual(res);
                    })
            });
        });
    });

    describe('Update Film API', () => {
        describe('Success scenario', () => {
            it('should update film', async () => {
                const film = {
                    "name": "Avengers Retruns",
                    "reviewer_id": userObj._id
                }
                return request(app.getHttpServer())
                    .put(`/films/${id}`)
                    .send(film)
                    .expect(HttpStatus.OK)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        const body = data.body;
                        expect(body).toBeTruthy();
                        expect(body.name).toEqual('Avengers Retruns');
                        expect(Object.keys(body)).toEqual([
                            '_id', 'name', 'description',
                            'release_date', 'rating',
                            'review', 'country',
                            'genres', 'photo',
                            'reviewer_id', 'created_at',
                            'updated_at',
                            'id', '__v'
                        ])
                    })
            });
        });

        describe('Failure response', () => {
            it('should return pre condition failed', async () => {
                const film = {
                    "name": "Avengers returns",
                    "reviewer_id": '123345'
                }
                const res = {
                    statusCode: 412,
                    message: 'Cast to ObjectId failed for value "123345" (type string) at path "_id" for model "User"',
                    error: 'Precondition Failed'
                }
                return request(app.getHttpServer())
                    .put(`/films/${id}`)
                    .send(film)
                    .expect(HttpStatus.PRECONDITION_FAILED)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        expect(data.body).toBeTruthy();
                        expect(data.body).toEqual(res);
                    })
            });
        });
    });

    describe('Get Film API', () => {
        describe('Success scenario', () => {
            it('should get film', async () => {
                return request(app.getHttpServer())
                    .get(`/films/${id}`)
                    .expect(HttpStatus.OK)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        const body = data.body;
                        expect(body).toBeTruthy();
                        expect(Object.keys(body)).toEqual([
                            '_id', 'name', 'description',
                            'release_date', 'rating',
                            'review', 'country',
                            'genres', 'photo',
                            'reviewer_id', 'created_at',
                            'updated_at',
                            'id', '__v'
                        ])
                    })
            });
        });
    });

    describe('Get All Films API', () => {
        describe('Success scenario', () => {
            it('should get all films', async () => {
                return request(app.getHttpServer())
                    .get(`/films`)
                    .expect(HttpStatus.OK)
                    .expect('Content-Type', /json/)
                    .then((data) => {
                        const body = data.body;
                        expect(body).toBeTruthy();
                        expect(body).toHaveLength(1);
                        expect(Object.keys(body[0])).toEqual([
                            '_id', 'name', 'description',
                            'release_date', 'rating',
                            'review', 'country',
                            'genres', 'photo',
                            'reviewer_id', 'created_at',
                            'updated_at',
                            'id', '__v'
                        ])
                    })
            });
        });
    });

    describe('Delete Film API', () => {
        describe('Success scenario', () => {
            it('should delete film', async () => {
                return request(app.getHttpServer())
                    .delete(`/films/${id}`)
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
});