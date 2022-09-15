import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import MongoMemoryServer from "mongodb-memory-server-core";

import { UserSchema } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

describe('User Service', () => {
    let mongod = null;
    let controller: UserController;
    let service: UserService;
    let id = null;
    let _id = null;

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
                const createUser: any = {
                    "name": "ravi shah",
                    "username": "ravi223",
                    "password": "Vijay@123",
                    "description": "description",
                    "is_reviewer": false
                }

                let data = await service.create(createUser);
                data = JSON.parse(JSON.stringify(data));
                expect(data).toBeTruthy();
                expect(Object.keys(data)).toEqual([
                    'name', 'username',
                    'password', 'description',
                    'is_reviewer', 'created_at',
                    'updated_at', '_id',
                    'id', '__v'
                ]);
                id = data.id;
                //@ts-ignore
                _id = data._id;
            });
        });
    });

    describe('Update User', () => {
        describe('Success scenario', () => {
            it('should update user', async () => {
                const updateUser: any = {
                    "name": "ravi b shah",
                    "description": "description",
                    "is_reviewer": true
                }

                let data = await service.update(id, updateUser);
                data = JSON.parse(JSON.stringify(data));
                expect(data.name).toBe('ravi b shah');
                expect(data.is_reviewer).toBeTruthy();
                expect(data).toBeTruthy();
                expect(Object.keys(data)).toEqual([
                    '_id', 'name', 'username',
                    'password', 'description',
                    'is_reviewer', 'created_at',
                    'updated_at',
                    'id', '__v'
                ]);
            });
        });
    });

    describe('Get User', () => {
        describe('Success scenario', () => {
            it('should get user', async () => {
                let data = await service.get(id);
                data = JSON.parse(JSON.stringify(data));
                expect(data).toBeTruthy();
                expect(Object.keys(data)).toEqual([
                    '_id', 'name', 'username',
                    'password', 'description',
                    'is_reviewer', 'created_at',
                    'updated_at',
                    'id', '__v'
                ]);
            });
        });

        describe('Failure scenario', () => {
            it('should return user not found', async () => {
                try {
                    await service.get('123');
                } catch (e) {
                    expect(e).toBeTruthy();
                    expect(e.message).toBe('User not found!')
                }
            });
        });
    });

    describe('Get All Users', () => {
        describe('Success scenario', () => {
            it('should get all user', async () => {
                const data = await service.getAll();
                expect(data).toBeTruthy();
                expect(data).toHaveLength(1);
            });
        });
    });

    describe('Get user by find one', () => {
        describe('Success scenario', () => {
            it('should get the user', async () => {
                let data = await service.findOne('ravi223');
                data = JSON.parse(JSON.stringify(data));
                expect(Object.keys(data)).toEqual([
                    '_id', 'name', 'username',
                    'password', 'description',
                    'is_reviewer', 'created_at',
                    'updated_at',
                    'id', '__v'
                ]);
            });
        });
    });

    describe('Get user by id', () => {
        describe('Success scenario', () => {
            it('should get the user', async () => {
                let data = await service.fetchUserById(_id);
                data = JSON.parse(JSON.stringify(data));
                expect(Object.keys(data)).toEqual([
                    '_id', 'name', 'username',
                    'password', 'description',
                    'is_reviewer', 'created_at',
                    'updated_at',
                    'id', '__v'
                ]);
            });
        });
    });

    describe('Get Delete User', () => {
        describe('Success scenario', () => {
            it('should delete user', async () => {
                const data = await service.delete(id);
                expect(data).toBeTruthy();
            });
        });
    });
});