import { MongooseModuleOptions } from "@nestjs/mongoose";

export const mongooseConfig = (): MongooseModuleOptions => ({
    database: {
        URI: process.env.MONGO_DB_URI
    }
});