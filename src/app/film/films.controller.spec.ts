import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import MongoMemoryServer from "mongodb-memory-server-core";
import { UserSchema } from "../user/schemas/user.schema";
import { UserService } from "../user/user.service";

import { FilmController } from "./film.controller";
import { FilmService } from "./film.service";
import { FilmSchema } from "./schemas/film.schema";

describe('Film Controller', () => {
    let mongod = null;
    let controller: FilmController;
    let service: FilmService;

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
    });

    afterAll(async () => {
        await mongod.stop();
    });

    describe('Create Film', () => {
        describe('Success scenario', () => {
            it('should create film', async () => {
                const resp: any = {
                    "name": "Avengers",
                    "description": "Super power",
                    "release_date": "23/02/2022",
                    "rating": 5,
                    "review": "Its a awsome movie!",
                    "country": "US",
                    "genres": [
                        "action"
                    ],
                    "photo": "https://google.com/avengers",
                    "reviewer_id": "6320aeeceaff22a3e899b7db",
                    "created_at": "2022-09-15T13:50:16.287Z",
                    "updated_at": "2022-09-15T13:50:16.287Z",
                    "_id": "63232d98d7834f2d8c1ce4ff",
                    "id": "flm850848fe-6897-4ee5-999f-2b44059d58b7",
                    "__v": 0
                }

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

                jest.spyOn(service, 'create').mockImplementationOnce(() => Promise.resolve(resp));

                const data = await controller.create(createFilm);
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
            });
        });
    });

    describe('Update Film', () => {
        describe('Success scenario', () => {
            it('should update film', async () => {
                const resp: any = {
                    "name": "Avengers",
                    "description": "Avengers have super power",
                    "release_date": "23/02/2022",
                    "rating": 4,
                    "review": "Its a awsome movie!",
                    "country": "US",
                    "genres": [
                        "action"
                    ],
                    "photo": "https://google.com/avengers",
                    "reviewer_id": "6320aeeceaff22a3e899b7db",
                    "created_at": "2022-09-15T13:50:16.287Z",
                    "updated_at": "2022-09-15T13:50:16.287Z",
                    "_id": "63232d98d7834f2d8c1ce4ff",
                    "id": "flm850848fe-6897-4ee5-999f-2b44059d58b7",
                    "__v": 0
                }

                const updateFilm: any = {
                    "name": "Avengers",
                    "description": "Avengers have super power",
                    "release_date": "23/02/2022",
                    "rating": 4,
                    "review": "Its a awsome movie!",
                    "country": "US",
                    "genres": ["action"],
                    "photo": "https://google.com/avengers",
                    "reviewer_id": "6320aeeceaff22a3e899b7db"
                }

                jest.spyOn(service, 'update').mockImplementationOnce(() => Promise.resolve(resp));

                const data = await controller.update(resp.id, updateFilm);
                expect(data).toBeTruthy();
                expect(data.description).toBe('Avengers have super power');
                expect(data.rating).toBe(4);
                expect(Object.keys(data)).toEqual([
                    'name', 'description',
                    'release_date', 'rating',
                    'review', 'country',
                    'genres', 'photo',
                    'reviewer_id', 'created_at',
                    'updated_at', '_id',
                    'id', '__v'
                ]);
            });
        });
    });

    describe('Get Film', () => {
        describe('Success scenario', () => {
            it('should get film', async () => {
                const resp: any = {
                    "name": "Avengers",
                    "description": "Avengers have super power",
                    "release_date": "23/02/2022",
                    "rating": 4,
                    "review": "Its a awsome movie!",
                    "country": "US",
                    "genres": [
                        "action"
                    ],
                    "photo": "https://google.com/avengers",
                    "reviewer_id": "6320aeeceaff22a3e899b7db",
                    "created_at": "2022-09-15T13:50:16.287Z",
                    "updated_at": "2022-09-15T13:50:16.287Z",
                    "_id": "63232d98d7834f2d8c1ce4ff",
                    "id": "flm850848fe-6897-4ee5-999f-2b44059d58b7",
                    "__v": 0
                }

                jest.spyOn(service, 'get').mockImplementationOnce(() => Promise.resolve(resp));

                const data = await controller.get(resp.id);
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
            });
        });
    });

    describe('Get Films', () => {
        describe('Success scenario', () => {
            it('should get films', async () => {
                const resp: any = [{
                    "name": "Avengers",
                    "description": "Avengers have super power",
                    "release_date": "23/02/2022",
                    "rating": 4,
                    "review": "Its a awsome movie!",
                    "country": "US",
                    "genres": [
                        "action"
                    ],
                    "photo": "https://google.com/avengers",
                    "reviewer_id": "6320aeeceaff22a3e899b7db",
                    "created_at": "2022-09-15T13:50:16.287Z",
                    "updated_at": "2022-09-15T13:50:16.287Z",
                    "_id": "63232d98d7834f2d8c1ce4ff",
                    "id": "flm850848fe-6897-4ee5-999f-2b44059d58b7",
                    "__v": 0
                }]

                jest.spyOn(service, 'getAll').mockImplementationOnce(() => Promise.resolve(resp));

                const data = await controller.getAll();
                expect(data).toBeTruthy();
                expect(data).toHaveLength(1);
            });
        });
    });

    describe('Delete Film', () => {
        describe('Success scenario', () => {
            it('should delete film', async () => {
                const resp: any = {
                    "acknowledged": true,
                    "deletedCount": 1
                }

                jest.spyOn(service, 'delete').mockImplementationOnce(() => Promise.resolve(resp));

                const data = await controller.delete('123');
                expect(data).toBeTruthy();
            });
        });
    });
});