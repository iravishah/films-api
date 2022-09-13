import { ConfigModuleOptions } from "@nestjs/config";
import * as path from "path";
import { mongooseConfig } from "./mognoose.config";

export function loadConfig(): ConfigModuleOptions {
    return {
        envFilePath: path.join(__dirname, '../../', (process.env.NODE_ENV || 'development') + '.env'),
        load: [mongooseConfig],
        expandVariables: true
    }
}