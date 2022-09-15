import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import MongoMemoryServer from "mongodb-memory-server-core";

import { UserSchema } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

describe('User Controller', () => {
    let mongod = null;
    let controller: UserController;
    let service: UserService;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => ({
                        uri: await mongod.getUri()
                    })
                }),
                MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
            ],
            controllers: [UserController],
            providers: [UserService],

        }).compile()

        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);
    });

    afterAll(async () => {
        await mongod.stop();
    });

    describe('Create User', () => {
        describe('Success scenario', () => {
            it('should create user', async () => {
                const resp: any = {
                    "name": "ravi shah",
                    "username": "ravi223",
                    "password": "$2b$10$KkuIgGRihrOO2kRbwaoriejzsfuTB2N/5aqHumxXQZqONvAPPMgim",
                    "description": "description",
                    "is_reviewer": false,
                    "created_at": "2022-09-15T07:35:53.553Z",
                    "updated_at": "2022-09-15T07:35:53.553Z",
                    "_id": "6322d5d928fdf85468328c5a",
                    "id": "flm5e9abf0d-e294-44ff-880e-be0fee994250",
                    "__v": 0
                }

                const createUser: any = {
                    "name": "ravi shah",
                    "username": "ravi223",
                    "password": "Vijay@123",
                    "description": "description",
                    "is_reviewer": false
                }

                jest.spyOn(service, 'create').mockImplementationOnce(() => Promise.resolve(resp));

                const data = await controller.create(createUser);
                expect(data).toBeTruthy();
                expect(Object.keys(data)).toEqual([
                    'name', 'username',
                    'password', 'description',
                    'is_reviewer', 'created_at',
                    'updated_at', '_id',
                    'id', '__v'
                ]);
            });
        });
    });

    describe('Update User', () => {
        describe('Success scenario', () => {
            it('should update user', async () => {
                const resp: any = {
                    "name": "ravi shah",
                    "username": "ravi223",
                    "password": "$2b$10$KkuIgGRihrOO2kRbwaoriejzsfuTB2N/5aqHumxXQZqONvAPPMgim",
                    "description": "description",
                    "is_reviewer": false,
                    "created_at": "2022-09-15T07:35:53.553Z",
                    "updated_at": "2022-09-15T07:35:53.553Z",
                    "_id": "6322d5d928fdf85468328c5a",
                    "id": "flm5e9abf0d-e294-44ff-880e-be0fee994250",
                    "__v": 0
                }

                const createUser: any = {
                    "name": "ravi shah",
                    "description": "description",
                    "is_reviewer": false
                }

                jest.spyOn(service, 'update').mockImplementationOnce(() => Promise.resolve(resp));

                const data = await controller.update(resp.id, createUser);
                expect(data).toBeTruthy();
                expect(Object.keys(data)).toEqual([
                    'name', 'username',
                    'password', 'description',
                    'is_reviewer', 'created_at',
                    'updated_at', '_id',
                    'id', '__v'
                ]);
            });
        });
    });

    describe('Get User', () => {
        describe('Success scenario', () => {
            it('should get user', async () => {
                const resp: any = {
                    "name": "ravi shah",
                    "username": "ravi223",
                    "password": "$2b$10$KkuIgGRihrOO2kRbwaoriejzsfuTB2N/5aqHumxXQZqONvAPPMgim",
                    "description": "description",
                    "is_reviewer": false,
                    "created_at": "2022-09-15T07:35:53.553Z",
                    "updated_at": "2022-09-15T07:35:53.553Z",
                    "_id": "6322d5d928fdf85468328c5a",
                    "id": "flm5e9abf0d-e294-44ff-880e-be0fee994250",
                    "__v": 0
                }

                jest.spyOn(service, 'get').mockImplementationOnce(() => Promise.resolve(resp));

                const data = await controller.get(resp.id);
                expect(data).toBeTruthy();
                expect(Object.keys(data)).toEqual([
                    'name', 'username',
                    'password', 'description',
                    'is_reviewer', 'created_at',
                    'updated_at', '_id',
                    'id', '__v'
                ]);
            });
        });
    });

    describe('Get All Users', () => {
        describe('Success scenario', () => {
            it('should get all user', async () => {
                const resp: any = [{
                    "name": "ravi shah",
                    "username": "ravi223",
                    "password": "$2b$10$KkuIgGRihrOO2kRbwaoriejzsfuTB2N/5aqHumxXQZqONvAPPMgim",
                    "description": "description",
                    "is_reviewer": false,
                    "created_at": "2022-09-15T07:35:53.553Z",
                    "updated_at": "2022-09-15T07:35:53.553Z",
                    "_id": "6322d5d928fdf85468328c5a",
                    "id": "flm5e9abf0d-e294-44ff-880e-be0fee994250",
                    "__v": 0
                }]

                jest.spyOn(service, 'getAll').mockImplementationOnce(() => Promise.resolve(resp));

                const data = await controller.getAll();
                expect(data).toBeTruthy();
                expect(data).toHaveLength(1);
            });
        });
    });

    describe('Get Delete User', () => {
        describe('Success scenario', () => {
            it('should delete user', async () => {
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