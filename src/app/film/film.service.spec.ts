import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import MongoMemoryServer from "mongodb-memory-server-core";
import { UserSchema } from "../user/schemas/user.schema";
import { UserService } from "../user/user.service";

import { FilmController } from "./film.controller";
import { FilmService } from "./film.service";
import { FilmSchema } from "./schemas/film.schema";

describe('Film Service', () => {
    let mongod = null;
    let controller: FilmController;
    let service: FilmService;
    let userService: UserService;
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
                MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }, { name: 'User', schema: UserSchema }])
            ],
            controllers: [FilmController],
            providers: [FilmService, UserService],

        }).compile()

        controller = module.get<FilmController>(FilmController);
        service = module.get<FilmService>(FilmService);
        userService = module.get<UserService>(UserService);
    });

    afterAll(async () => {
        await mongod.stop();
    });

    describe('Create Film', () => {
        describe('Success scenario', () => {
            it('should create film', async () => {
                const createFilm: any = {
                    "name": "Avengers",
                    "description": "Super power",
                    "release_date": "23/02/2022",
                    "rating": 5,
                    "review": "Its a awsome movie!",
                    "country": "US",
                    "genres": ["action"],
                    "photo": "https://google.com/avengers",
                    "reviewer_id": "6320aeeceaff22a3e899b7db"
                }

                const resp: any = {
                    "_id": "6320aeeceaff22a3e899b7db",
                    "name": "ravi shah",
                    "username": "ravi.shah",
                    "password": "$2b$10$P8/H2zOJErwH/KlbXMnCkuZ82EwkDV.yTk5Um/QccSDZ2HhIu9b/C",
                    "description": "description",
                    "is_reviewer": true,
                    "created_at": "2022-09-13T16:25:16.215Z",
                    "updated_at": "2022-09-13T16:25:16.215Z",
                    "id": "bdb3af4eb9-6e6e-40b1-982f-54b85da3496e",
                    "__v": 0
                }

                jest.spyOn(userService, 'fetchUserById').mockImplementationOnce(() => Promise.resolve(resp));

                let data = await service.create(createFilm);
                data = JSON.parse(JSON.stringify(data));
                expect(data).toBeTruthy();
                expect(Object.keys(data)).toEqual([
                    'name', 'description',
                    'release_date', 'rating',
                    'review', 'country',
                    'genres', 'photo',
                    'reviewer_id', 'created_at',
                    'updated_at', '_id',
                    'id', '__v'
                ]);
                id = data.id;
            });
        });

        describe('Failure scenario', () => {
            it('should return user not found while creating film', async () => {
                const createFilm: any = {
                    "name": "Avengers",
                    "description": "Super power",
                    "release_date": "23/02/2022",
                    "rating": 5,
                    "review": "Its a awsome movie!",
                    "country": "US",
                    "genres": ["action"],
                    "photo": "https://google.com/avengers",
                    "reviewer_id": "6320aeeceaff22a3e899b7db"
                }

                jest.spyOn(userService, 'fetchUserById').mockImplementationOnce(() => Promise.resolve(null));

                try {
                    await service.create(createFilm);
                } catch (e) {
                    expect(e).toBeTruthy();
                    expect(e.message).toBe('User not found!');
                }
            });

            it('should return user have to be reviewer', async () => {
                const createFilm: any = {
                    "name": "Avengers",
                    "description": "Super power",
                    "release_date": "23/02/2022",
                    "rating": 5,
                    "review": "Its a awsome movie!",
                    "country": "US",
                    "genres": ["action"],
                    "photo": "https://google.com/avengers",
                    "reviewer_id": "6320aeeceaff22a3e899b7db"
                }

                const resp: any = {
                    "_id": "6320aeeceaff22a3e899b7db",
                    "name": "ravi shah",
                    "username": "ravi.shah",
                    "password": "$2b$10$P8/H2zOJErwH/KlbXMnCkuZ82EwkDV.yTk5Um/QccSDZ2HhIu9b/C",
                    "description": "description",
                    "is_reviewer": false,
                    "created_at": "2022-09-13T16:25:16.215Z",
                    "updated_at": "2022-09-13T16:25:16.215Z",
                    "id": "bdb3af4eb9-6e6e-40b1-982f-54b85da3496e",
                    "__v": 0
                }

                jest.spyOn(userService, 'fetchUserById').mockImplementationOnce(() => Promise.resolve(resp));

                try {
                    await service.create(createFilm);
                } catch (e) {
                    expect(e).toBeTruthy();
                    expect(e.message).toBe('You have to be reviewer to post the review');
                }
            });
        });
    });

    describe('Update Film', () => {
        describe('Success scenario', () => {
            it('should update film', async () => {
                const updateFilm: any = {
                    "name": "Avengers",
                    "description": "This is a super power moview",
                    "release_date": "23/02/2022",
                    "rating": 5,
                    "review": "Its a awsome movie!",
                    "country": "US",
                    "genres": ["action"],
                    "photo": "https://google.com/avengers",
                    "reviewer_id": "6320aeeceaff22a3e899b7db"
                }

                const resp: any = {
                    "_id": "6320aeeceaff22a3e899b7db",
                    "name": "ravi shah",
                    "username": "ravi.shah",
                    "password": "$2b$10$P8/H2zOJErwH/KlbXMnCkuZ82EwkDV.yTk5Um/QccSDZ2HhIu9b/C",
                    "description": "description",
                    "is_reviewer": true,
                    "created_at": "2022-09-13T16:25:16.215Z",
                    "updated_at": "2022-09-13T16:25:16.215Z",
                    "id": "bdb3af4eb9-6e6e-40b1-982f-54b85da3496e",
                    "__v": 0
                }

                jest.spyOn(userService, 'fetchUserById').mockImplementationOnce(() => Promise.resolve(resp));

                let data = await service.update(id, updateFilm);
                data = JSON.parse(JSON.stringify(data));
                expect(data).toBeTruthy();
                expect(Object.keys(data)).toEqual([
                    '_id', 'name', 'description',
                    'release_date', 'rating',
                    'review', 'country',
                    'genres', 'photo',
                    'reviewer_id', 'created_at',
                    'updated_at',
                    'id', '__v'
                ]);
            });
        });

        describe('Failure scenario', () => {
            it('should return user not found while creating film', async () => {
                const updateFilm: any = {
                    "name": "Avengers",
                    "description": "Super power",
                    "release_date": "23/02/2022",
                    "rating": 5,
                    "review": "Its a awsome movie!",
                    "country": "US",
                    "genres": ["action"],
                    "photo": "https://google.com/avengers",
                    "reviewer_id": "6320aeeceaff22a3e899b7db"
                }

                jest.spyOn(userService, 'fetchUserById').mockImplementationOnce(() => Promise.resolve(null));

                try {
                    await service.update(id, updateFilm);
                } catch (e) {
                    expect(e).toBeTruthy();
                    expect(e.message).toBe('User not found!');
                }
            });

            it('should return user have to be reviewer', async () => {
                const updateFilm: any = {
                    "name": "Avengers",
                    "description": "Super power",
                    "release_date": "23/02/2022",
                    "rating": 5,
                    "review": "Its a awsome movie!",
                    "country": "US",
                    "genres": ["action"],
                    "photo": "https://google.com/avengers",
                    "reviewer_id": "6320aeeceaff22a3e899b7db"
                }

                const resp: any = {
                    "_id": "6320aeeceaff22a3e899b7db",
                    "name": "ravi shah",
                    "username": "ravi.shah",
                    "password": "$2b$10$P8/H2zOJErwH/KlbXMnCkuZ82EwkDV.yTk5Um/QccSDZ2HhIu9b/C",
                    "description": "description",
                    "is_reviewer": false,
                    "created_at": "2022-09-13T16:25:16.215Z",
                    "updated_at": "2022-09-13T16:25:16.215Z",
                    "id": "bdb3af4eb9-6e6e-40b1-982f-54b85da3496e",
                    "__v": 0
                }

                jest.spyOn(userService, 'fetchUserById').mockImplementationOnce(() => Promise.resolve(resp));

                try {
                    await service.update(id, updateFilm);
                } catch (e) {
                    expect(e).toBeTruthy();
                    expect(e.message).toBe('You have to be reviewer to post the review');
                }
            });
        });
    });

    describe('Get Film', () => {
        describe('Success scenario', () => {
            it('should get film', async () => {
                let data = await service.get(id);
                data = JSON.parse(JSON.stringify(data));
                expect(data).toBeTruthy();
                expect(Object.keys(data)).toEqual([
                    '_id', 'name', 'description',
                    'release_date', 'rating',
                    'review', 'country',
                    'genres', 'photo',
                    'reviewer_id', 'created_at',
                    'updated_at',
                    'id', '__v'
                ]);
            });
        });

        describe('Failure scenario', () => {
            it('should return film not found', async () => {
                try {
                    await service.get('dummy_id');
                } catch (e) {
                    expect(e).toBeTruthy();
                    expect(e.message).toBe('Film not found!');
                }
            });
        });
    });

    describe('Get Films', () => {
        describe('Success scenario', () => {
            it('should get films', async () => {
                const data = await service.getAll();
                expect(data).toBeTruthy();
                expect(data).toHaveLength(1);
            });
        });
    });

    describe('Delete Film', () => {
        describe('Success scenario', () => {
            it('should delete film', async () => {
                const data = await controller.delete(id);
                expect(data).toBeTruthy();
            });
        });
    });
});